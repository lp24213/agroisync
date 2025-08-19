import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'star' | 'nebula' | 'particle' | 'energy' | 'portal';
  color: string;
  rotation: number;
  scale: number;
}

const CosmicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Criar partículas cósmicas
    const createParticles = () => {
      const particles: Particle[] = [];

      // Estrelas cintilantes
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          type: 'star',
          color: `hsl(${Math.random() * 60 + 200}, 100%, 80%)`,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5
        });
      }

      // Nebulosas cósmicas
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 200 + 100,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          opacity: Math.random() * 0.3 + 0.1,
          type: 'nebula',
          color: `hsl(${Math.random() * 60 + 250}, 70%, 60%)`,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.8 + 0.6
        });
      }

      // Partículas de energia
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 8 + 4,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1,
          opacity: Math.random() * 0.6 + 0.4,
          type: 'particle',
          color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.6 + 0.8
        });
      }

      // Ondas de energia
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 150 + 100,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.4 + 0.2,
          type: 'energy',
          color: `hsl(${Math.random() * 60 + 200}, 80%, 60%)`,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.7 + 0.9
        });
      }

      // Portais quânticos
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 80 + 60,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.3,
          type: 'portal',
          color: `hsl(${Math.random() * 60 + 280}, 90%, 70%)`,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.8 + 0.6
        });
      }

      particlesRef.current = particles;
    };

    // Renderizar partículas
    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Atualizar posição
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += 0.5;
        particle.scale = 0.8 + Math.sin(Date.now() * 0.001 + index) * 0.2;

        // Manter partículas na tela
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.scale(particle.scale, particle.scale);

        switch (particle.type) {
          case 'star':
            // Estrela cintilante
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Brilho da estrela
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(0, 0, particle.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'nebula':
            // Nebulosa cósmica
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
            gradient.addColorStop(0, `${particle.color}40`);
            gradient.addColorStop(0.5, `${particle.color}20`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'particle':
            // Partícula de energia
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Anel de energia
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = particle.opacity * 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            break;

          case 'energy':
            // Onda de energia
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 3;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 10;
            
            // Múltiplas ondas
            for (let i = 0; i < 3; i++) {
              ctx.globalAlpha = particle.opacity * (1 - i * 0.3);
              ctx.beginPath();
              ctx.ellipse(0, 0, particle.size * (1 + i * 0.2), particle.size * 0.1, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
            break;

          case 'portal':
            // Portal quântico
            const portalGradient = ctx.createConicGradient(0, 0, 0);
            portalGradient.addColorStop(0, particle.color);
            portalGradient.addColorStop(0.25, `hsl(${Math.random() * 60 + 200}, 80%, 60%)`);
            portalGradient.addColorStop(0.5, `hsl(${Math.random() * 60 + 280}, 90%, 70%)`);
            portalGradient.addColorStop(0.75, `hsl(${Math.random() * 60 + 320}, 85%, 65%)`);
            portalGradient.addColorStop(1, particle.color);
            
            ctx.fillStyle = portalGradient;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Anel interno
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      });
    };

    // Loop de animação
    const animate = () => {
      renderParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default CosmicParticles;
