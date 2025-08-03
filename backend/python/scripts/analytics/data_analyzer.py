#!/usr/bin/env python3
"""
AGROTM Data Analyzer
High-performance data analysis and ML pipeline for AGROTM platform
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import structlog
from motor.motor_asyncio import AsyncIOMotorClient
from redis import asyncio as aioredis
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

from .models import (
    PortfolioData,
    MarketData,
    StakingData,
    AnalyticsResult,
    PredictionResult,
    RiskMetrics
)

logger = structlog.get_logger()

class AGROTMDataAnalyzer:
    """High-performance data analyzer for AGROTM platform"""
    
    def __init__(self, mongo_uri: str, redis_uri: str):
        self.mongo_client = AsyncIOMotorClient(mongo_uri)
        self.redis_client = aioredis.from_url(redis_uri)
        self.db = self.mongo_client.agrotm
        self.scaler = StandardScaler()
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        
    async def analyze_portfolio_performance(
        self, 
        portfolio_id: str, 
        timeframe: str = "30d"
    ) -> AnalyticsResult:
        """Analyze portfolio performance with advanced metrics"""
        
        # Get portfolio data
        portfolio_data = await self._get_portfolio_data(portfolio_id, timeframe)
        
        if portfolio_data.empty:
            raise ValueError(f"No data found for portfolio {portfolio_id}")
        
        # Calculate performance metrics
        total_return = self._calculate_total_return(portfolio_data)
        volatility = self._calculate_volatility(portfolio_data)
        sharpe_ratio = self._calculate_sharpe_ratio(portfolio_data)
        max_drawdown = self._calculate_max_drawdown(portfolio_data)
        win_rate = self._calculate_win_rate(portfolio_data)
        
        # Calculate risk metrics
        risk_metrics = RiskMetrics(
            volatility=volatility,
            sharpe_ratio=sharpe_ratio,
            max_drawdown=max_drawdown,
            var_95=self._calculate_var(portfolio_data, 0.95),
            cvar_95=self._calculate_cvar(portfolio_data, 0.95),
            beta=self._calculate_beta(portfolio_data),
            alpha=self._calculate_alpha(portfolio_data)
        )
        
        # Generate performance chart
        performance_chart = self._generate_performance_chart(portfolio_data)
        
        # Cache results
        await self._cache_analytics_result(portfolio_id, {
            "total_return": total_return,
            "volatility": volatility,
            "sharpe_ratio": sharpe_ratio,
            "max_drawdown": max_drawdown,
            "win_rate": win_rate,
            "risk_metrics": risk_metrics.dict(),
            "chart": performance_chart,
            "timestamp": datetime.utcnow().isoformat()
        })
        
        return AnalyticsResult(
            portfolio_id=portfolio_id,
            total_return=total_return,
            volatility=volatility,
            sharpe_ratio=sharpe_ratio,
            max_drawdown=max_drawdown,
            win_rate=win_rate,
            risk_metrics=risk_metrics,
            performance_chart=performance_chart
        )
    
    async def predict_portfolio_performance(
        self, 
        portfolio_id: str, 
        days_ahead: int = 30
    ) -> PredictionResult:
        """Predict portfolio performance using ML models"""
        
        # Get historical data
        historical_data = await self._get_portfolio_data(portfolio_id, "365d")
        
        if historical_data.empty:
            raise ValueError(f"Insufficient data for prediction")
        
        # Prepare features
        features = self._prepare_prediction_features(historical_data)
        
        # Train model
        X_train, y_train = self._prepare_training_data(features)
        self.model.fit(X_train, y_train)
        
        # Make prediction
        X_pred = self._prepare_prediction_data(features, days_ahead)
        prediction = self.model.predict(X_pred)
        
        # Calculate confidence intervals
        confidence_intervals = self._calculate_confidence_intervals(prediction)
        
        # Generate prediction chart
        prediction_chart = self._generate_prediction_chart(
            historical_data, prediction, confidence_intervals
        )
        
        return PredictionResult(
            portfolio_id=portfolio_id,
            predicted_return=prediction[-1],
            confidence_lower=confidence_intervals[0],
            confidence_upper=confidence_intervals[1],
            prediction_chart=prediction_chart,
            model_accuracy=self._calculate_model_accuracy()
        )
    
    async def analyze_market_trends(self) -> Dict:
        """Analyze overall market trends and patterns"""
        
        # Get market data
        market_data = await self._get_market_data()
        
        # Calculate market indicators
        market_indicators = {
            "total_market_cap": market_data["market_cap"].sum(),
            "market_volatility": market_data["returns"].std(),
            "correlation_matrix": market_data[["BTC", "ETH", "AGROTM"]].corr().to_dict(),
            "trend_direction": self._calculate_trend_direction(market_data),
            "volume_analysis": self._analyze_volume_patterns(market_data)
        }
        
        # Generate market charts
        market_charts = {
            "price_chart": self._generate_market_price_chart(market_data),
            "volume_chart": self._generate_market_volume_chart(market_data),
            "correlation_heatmap": self._generate_correlation_heatmap(market_data)
        }
        
        return {
            "indicators": market_indicators,
            "charts": market_charts,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def analyze_staking_performance(self) -> Dict:
        """Analyze staking pool performance and rewards"""
        
        # Get staking data
        staking_data = await self._get_staking_data()
        
        # Calculate staking metrics
        staking_metrics = {
            "total_staked": staking_data["amount"].sum(),
            "average_apr": staking_data["apr"].mean(),
            "total_rewards": staking_data["rewards"].sum(),
            "active_stakers": len(staking_data),
            "reward_distribution": self._analyze_reward_distribution(staking_data)
        }
        
        # Generate staking charts
        staking_charts = {
            "apr_comparison": self._generate_apr_comparison_chart(staking_data),
            "reward_timeline": self._generate_reward_timeline_chart(staking_data),
            "staker_distribution": self._generate_staker_distribution_chart(staking_data)
        }
        
        return {
            "metrics": staking_metrics,
            "charts": staking_charts,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _calculate_total_return(self, data: pd.DataFrame) -> float:
        """Calculate total return from portfolio data"""
        if len(data) < 2:
            return 0.0
        
        initial_value = data.iloc[0]["value"]
        final_value = data.iloc[-1]["value"]
        return (final_value - initial_value) / initial_value
    
    def _calculate_volatility(self, data: pd.DataFrame) -> float:
        """Calculate portfolio volatility"""
        returns = data["value"].pct_change().dropna()
        return returns.std() * np.sqrt(252)  # Annualized
    
    def _calculate_sharpe_ratio(self, data: pd.DataFrame) -> float:
        """Calculate Sharpe ratio"""
        returns = data["value"].pct_change().dropna()
        excess_returns = returns - 0.02 / 252  # Assuming 2% risk-free rate
        return excess_returns.mean() / returns.std() * np.sqrt(252)
    
    def _calculate_max_drawdown(self, data: pd.DataFrame) -> float:
        """Calculate maximum drawdown"""
        cumulative = data["value"].cummax()
        drawdown = (data["value"] - cumulative) / cumulative
        return drawdown.min()
    
    def _calculate_win_rate(self, data: pd.DataFrame) -> float:
        """Calculate win rate (positive return days)"""
        returns = data["value"].pct_change().dropna()
        return (returns > 0).mean()
    
    def _calculate_var(self, data: pd.DataFrame, confidence: float) -> float:
        """Calculate Value at Risk"""
        returns = data["value"].pct_change().dropna()
        return np.percentile(returns, (1 - confidence) * 100)
    
    def _calculate_cvar(self, data: pd.DataFrame, confidence: float) -> float:
        """Calculate Conditional Value at Risk"""
        returns = data["value"].pct_change().dropna()
        var = self._calculate_var(data, confidence)
        return returns[returns <= var].mean()
    
    def _calculate_beta(self, data: pd.DataFrame) -> float:
        """Calculate portfolio beta"""
        # This would need market data for comparison
        return 1.0  # Placeholder
    
    def _calculate_alpha(self, data: pd.DataFrame) -> float:
        """Calculate portfolio alpha"""
        # This would need market data for comparison
        return 0.0  # Placeholder
    
    def _generate_performance_chart(self, data: pd.DataFrame) -> Dict:
        """Generate interactive performance chart"""
        fig = make_subplots(
            rows=2, cols=1,
            subplot_titles=("Portfolio Value", "Daily Returns"),
            vertical_spacing=0.1
        )
        
        # Portfolio value chart
        fig.add_trace(
            go.Scatter(
                x=data.index,
                y=data["value"],
                mode="lines",
                name="Portfolio Value",
                line=dict(color="blue")
            ),
            row=1, col=1
        )
        
        # Returns chart
        returns = data["value"].pct_change().dropna()
        fig.add_trace(
            go.Bar(
                x=returns.index,
                y=returns,
                name="Daily Returns",
                marker_color=["green" if x > 0 else "red" for x in returns]
            ),
            row=2, col=1
        )
        
        fig.update_layout(
            title="Portfolio Performance Analysis",
            height=600,
            showlegend=True
        )
        
        return fig.to_dict()
    
    async def _get_portfolio_data(self, portfolio_id: str, timeframe: str) -> pd.DataFrame:
        """Get portfolio data from database"""
        # Implementation would fetch from MongoDB
        # This is a placeholder
        dates = pd.date_range(start="2023-01-01", end="2023-12-31", freq="D")
        values = np.random.normal(10000, 500, len(dates)).cumsum()
        return pd.DataFrame({"value": values}, index=dates)
    
    async def _cache_analytics_result(self, portfolio_id: str, result: Dict):
        """Cache analytics result in Redis"""
        key = f"analytics:portfolio:{portfolio_id}"
        await self.redis_client.setex(key, 3600, json.dumps(result))  # 1 hour TTL
    
    def _prepare_prediction_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for ML prediction"""
        features = pd.DataFrame()
        features["returns"] = data["value"].pct_change()
        features["volatility"] = features["returns"].rolling(30).std()
        features["momentum"] = data["value"].pct_change(30)
        features["ma_short"] = data["value"].rolling(7).mean()
        features["ma_long"] = data["value"].rolling(30).mean()
        return features.dropna()
    
    def _prepare_training_data(self, features: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare training data for ML model"""
        X = features.drop("returns", axis=1).values
        y = features["returns"].values
        return self.scaler.fit_transform(X), y
    
    def _prepare_prediction_data(self, features: pd.DataFrame, days_ahead: int) -> np.ndarray:
        """Prepare data for prediction"""
        X = features.iloc[-days_ahead:].drop("returns", axis=1).values
        return self.scaler.transform(X)
    
    def _calculate_confidence_intervals(self, prediction: np.ndarray) -> Tuple[float, float]:
        """Calculate confidence intervals for prediction"""
        std = prediction.std()
        return prediction[-1] - 1.96 * std, prediction[-1] + 1.96 * std
    
    def _calculate_model_accuracy(self) -> float:
        """Calculate model accuracy (placeholder)"""
        return 0.85  # Placeholder
    
    async def close(self):
        """Close database connections"""
        self.mongo_client.close()
        await self.redis_client.close()

# Usage example
async def main():
    analyzer = AGROTMDataAnalyzer(
        mongo_uri="mongodb://localhost:27017",
        redis_uri="redis://localhost:6379"
    )
    
    try:
        # Analyze portfolio performance
        result = await analyzer.analyze_portfolio_performance("portfolio_123")
        print(f"Portfolio Analysis: {result}")
        
        # Predict future performance
        prediction = await analyzer.predict_portfolio_performance("portfolio_123")
        print(f"Prediction: {prediction}")
        
        # Analyze market trends
        market_analysis = await analyzer.analyze_market_trends()
        print(f"Market Analysis: {market_analysis}")
        
    finally:
        await analyzer.close()

if __name__ == "__main__":
    asyncio.run(main()) 