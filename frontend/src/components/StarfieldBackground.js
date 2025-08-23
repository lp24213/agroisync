import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const StarfieldBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Só renderizar no tema escuro
    if (theme !== 'dark') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas para tela cheia
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configurações das estrelas
    const stars = [];
    const numStars = 200;
    const nebulaParticles = [];
    const numNebulaParticles = 50;

    // Criar estrelas
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        brightness: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    // Criar partículas de nebulosa
    for (let i = 0; i < numNebulaParticles; i++) {
      nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.3 + 0.1,
        color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`
      });
    }

    // Função de animação
    const animate = () => {
      // Limpar canvas com gradiente escuro
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar nebulosa
      ctx.globalCompositeOperation = 'screen';
      nebulaParticles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Mover partícula
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
      });

      // Desenhar estrelas
      ctx.globalCompositeOperation = 'source-over';
      stars.forEach(star => {
        // Efeito de piscar
        const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7;
        const brightness = star.brightness * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
        
        // Adicionar brilho
        if (star.size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.3})`;
          ctx.fill();
        }
        
        // Mover estrela
        star.y += star.speed;
        star.twinkle += 0.02;
        
        if (star.y > canvas.height) {
          star.y = -star.size;
          star.x = Math.random() * canvas.width;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [theme]);

  // Não renderizar se não for tema escuro
  if (theme !== 'dark') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 pointer-events-none z-0"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)'
        }}
      />
    </motion.div>
  );
};

export default StarfieldBackground;
