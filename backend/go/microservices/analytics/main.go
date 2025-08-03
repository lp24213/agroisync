package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"agrotm/analytics/internal/config"
	"agrotm/analytics/internal/handlers"
	"agrotm/analytics/internal/middleware"
	"agrotm/analytics/internal/models"
	"agrotm/analytics/internal/repository"
	"agrotm/analytics/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found")
	}

	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)

	// Load configuration
	cfg := config.Load()

	// Connect to MongoDB
	mongoClient, err := mongo.Connect(context.Background(), options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		logger.Fatal("Failed to connect to MongoDB:", err)
	}
	defer mongoClient.Disconnect(context.Background())

	// Ping MongoDB
	if err := mongoClient.Ping(context.Background(), nil); err != nil {
		logger.Fatal("Failed to ping MongoDB:", err)
	}

	// Connect to Redis
	redisClient := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr,
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
	})
	defer redisClient.Close()

	// Ping Redis
	if err := redisClient.Ping(context.Background()).Err(); err != nil {
		logger.Fatal("Failed to connect to Redis:", err)
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(mongoClient.Database(cfg.MongoDB))
	analyticsRepo := repository.NewAnalyticsRepository(mongoClient.Database(cfg.MongoDB))
	cacheRepo := repository.NewCacheRepository(redisClient)

	// Initialize services
	userService := services.NewUserService(userRepo, cacheRepo)
	analyticsService := services.NewAnalyticsService(analyticsRepo, cacheRepo)
	authService := services.NewAuthService(cfg.JWTSecret)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userService, authService)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService, authService)

	// Setup Gin router
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	// Middleware
	router.Use(gin.Recovery())
	router.Use(middleware.Logger(logger))
	router.Use(middleware.CORS())
	router.Use(middleware.RateLimit(redisClient))
	router.Use(middleware.Metrics())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
			"service":   "agrotm-analytics",
		})
	})

	// Metrics endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// API routes
	api := router.Group("/api/v1")
	{
		// Public routes
		api.POST("/auth/login", userHandler.Login)
		api.POST("/auth/register", userHandler.Register)

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.Auth(authService))
		{
			// User routes
			users := protected.Group("/users")
			{
				users.GET("/profile", userHandler.GetProfile)
				users.PUT("/profile", userHandler.UpdateProfile)
				users.GET("/portfolio", userHandler.GetPortfolio)
			}

			// Analytics routes
			analytics := protected.Group("/analytics")
			{
				analytics.GET("/dashboard", analyticsHandler.GetDashboard)
				analytics.GET("/portfolio/:id", analyticsHandler.GetPortfolioAnalytics)
				analytics.GET("/performance", analyticsHandler.GetPerformanceMetrics)
				analytics.GET("/trends", analyticsHandler.GetTrends)
				analytics.POST("/events", analyticsHandler.TrackEvent)
			}
		}
	}

	// WebSocket endpoint for real-time analytics
	router.GET("/ws/analytics", analyticsHandler.HandleWebSocket)

	// Start server
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		logger.Infof("Starting analytics service on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Failed to start server:", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Info("Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced to shutdown:", err)
	}

	logger.Info("Server exited")
} 