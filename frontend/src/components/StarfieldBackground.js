import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const StarfieldBackground = () => {
  const { isDark } = useTheme()
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    // Só renderizar no tema escuro
    if (!isDark) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Configurar canvas para tela cheia
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Configurações das estrelas
    const stars = []
    const numStars = Math.min(150, Math.floor(window.innerWidth / 4)); // Responsivo
    const nebulaParticles = []
    const numNebulaParticles = Math.min(30, Math.floor(window.innerWidth / 8)); // Responsivo

    // Criar estrelas
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.05, // Mais lento para melhor performance
        brightness: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        color: `hsl(${200 + Math.random() * 40}, 80%, ${70 + Math.random() * 20}%)`
      })
    }

    // Criar partículas de nebulosa
    for (let i = 0; i < numNebulaParticles; i++) {
      nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.1 + 0.02, // Mais lento
        opacity: Math.random() * 0.2 + 0.05, // Mais sutil
        color: `hsl(${200 + Math.random() * 40}, 70%, 60%)`
      })
    }

    // Função de animação otimizada
    const animate = () => {
      // Limpar canvas com gradiente escuro sutil
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      )
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Desenhar nebulosa com composição otimizada
      ctx.globalCompositeOperation = 'screen'
      nebulaParticles.forEach(particle => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        // Mover partícula
        particle.y += particle.speed
        if (particle.y > canvas.height) {
          particle.y = -particle.size
          particle.x = Math.random() * canvas.width
        }
      })

      // Desenhar estrelas otimizado
      ctx.globalCompositeOperation = 'source-over'
      stars.forEach(star => {
        // Efeito de piscar mais suave
        const twinkle = Math.sin(star.twinkle) * 0.2 + 0.8
        const brightness = star.brightness * twinkle

        // Desenhar estrela principal
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`
        ctx.fill()

        // Adicionar brilho apenas para estrelas grandes
        if (star.size > 1.2) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.2})`
          ctx.fill()
        }

        // Mover estrela
        star.y += star.speed
        star.twinkle += 0.015; // Piscar mais lento

        if (star.y > canvas.height) {
          star.y = -star.size
          star.x = Math.random() * canvas.width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isDark])

  // Não renderizar se não for tema escuro
  if (!isDark) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className='pointer-events-none fixed inset-0 z-0'
    >
      <canvas
        ref={canvasRef}
        className='h-full w-full'
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </motion.div>
  )
}

export default StarfieldBackground
