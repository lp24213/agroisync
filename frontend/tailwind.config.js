/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Habilita modo escuro baseado em classe
  theme: {
    extend: {
      colors: {
        // Tema Claro - Padrão (sempre ativo por padrão)
        'light': {
          'bg-primary': '#ffffff',
          'bg-secondary': '#f8fafc',
          'bg-card': 'rgba(255, 255, 255, 0.95)',
          'bg-card-hover': 'rgba(248, 250, 252, 0.98)',
          'text-primary': '#1e293b',
          'text-secondary': '#475569',
          'text-tertiary': '#64748b',
          'border-primary': 'rgba(30, 41, 59, 0.08)',
          'border-accent': 'rgba(100, 116, 139, 0.2)',
          'accent-primary': '#64748b', // Cinza neutro profissional
          'accent-secondary': '#94a3b8', // Cinza médio sutil
          'accent-tertiary': '#cbd5e1', // Cinza claro suave
          'glass-bg': 'rgba(255, 255, 255, 0.9)',
        },
        // Tema Escuro - Profissional com fundo escuro neutro (só quando ativado)
        'dark': {
          'bg-primary': '#0f172a',
          'bg-secondary': '#1e293b',
          'bg-card': 'rgba(30, 41, 59, 0.9)',
          'bg-card-hover': 'rgba(51, 65, 85, 0.95)',
          'text-primary': '#f8fafc',
          'text-secondary': '#e2e8f0',
          'text-tertiary': '#cbd5e1',
          'border-primary': 'rgba(248, 250, 252, 0.08)',
          'border-accent': 'rgba(148, 163, 184, 0.2)',
          'accent-primary': '#94a3b8',
          'accent-secondary': '#64748b',
          'accent-tertiary': '#475569',
          'glass-bg': 'rgba(15, 23, 42, 0.8)',
        },
        // Cores neutras profissionais
        'neutral': {
          '50': '#fafafa',
          '100': '#f5f5f5',
          '200': '#e5e5e5',
          '300': '#d4d4d4',
          '400': '#a3a3a3',
          '500': '#737373',
          '600': '#525252',
          '700': '#404040',
          '800': '#262626',
          '900': '#171717',
          '950': '#0a0a0a',
        },
        // Cores de suporte para o tema claro - tons neutros
        'stone': {
          '50': '#fafaf9',
          '100': '#f5f5f4',
          '200': '#e7e5e4',
          '300': '#d6d3d1',
          '400': '#a8a29e',
          '500': '#78716c',
          '600': '#57534e',
          '700': '#44403c',
          '800': '#292524',
          '900': '#1c1917',
        },
        'slate': {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '300': '#cbd5e1',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '700': '#334155',
          '800': '#1e293b',
          '900': '#0f172a',
        },
        // NOVAS CORES AGRO + WEB3 (acentos sofisticados)
        'agro': {
          'green': {
            '50': '#f0fdf4',
            '100': '#dcfce7',
            '200': '#bbf7d0',
            '300': '#86efac',
            '400': '#4ade80',
            '500': '#22c55e',
            '600': '#16a34a',
            '700': '#15803d',
            '800': '#166534',
            '900': '#14532d',
            '950': '#052e16',
          },
          'yellow': {
            '50': '#fefce8',
            '100': '#fef3c7',
            '200': '#fde68a',
            '300': '#fcd34d',
            '400': '#fbbf24',
            '500': '#f59e0b',
            '600': '#d97706',
            '700': '#b45309',
            '800': '#92400e',
            '900': '#78350f',
            '950': '#451a03',
          },
          'brown': {
            '50': '#fdf8f6',
            '100': '#f2e8e5',
            '200': '#eaddd7',
            '300': '#e0cec7',
            '400': '#d2bab0',
            '500': '#bfa094',
            '600': '#a18072',
            '700': '#977669',
            '800': '#846358',
            '900': '#43302b',
            '950': '#2d1b1b',
          }
        },
        'web3': {
          'neon': {
            'blue': '#00d4ff',
            'green': '#00ff88',
            'purple': '#8b5cf6',
            'cyan': '#06b6d4',
            'emerald': '#10b981',
            'teal': '#14b8a6',
          },
          'glow': {
            'blue': 'rgba(0, 212, 255, 0.3)',
            'green': 'rgba(0, 255, 136, 0.3)',
            'purple': 'rgba(139, 92, 246, 0.3)',
            'cyan': 'rgba(6, 182, 212, 0.3)',
            'emerald': 'rgba(16, 185, 129, 0.3)',
            'teal': 'rgba(20, 184, 166, 0.3)',
          }
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'system': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        // NOVAS ANIMAÇÕES PREMIUM
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.8s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.8s ease-out forwards",
        "fade-in-right": "fadeInRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 4s ease-in-out infinite",
        "marquee": "marquee 20s linear infinite",
        "marquee-reverse": "marqueeReverse 20s linear infinite",
      },
      keyframes: {
        "fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "slideUp": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        // NOVAS KEYFRAMES PREMIUM
        "fadeInUp": {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "fadeInDown": {
          "0%": { opacity: 0, transform: "translateY(-30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "fadeInLeft": {
          "0%": { opacity: 0, transform: "translateX(-30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        "fadeInRight": {
          "0%": { opacity: 0, transform: "translateX(30px)" },
          "100%": { opacity: 1, transform: "translateX(0)" }
        },
        "scaleIn": {
          "0%": { opacity: 0, transform: "scale(0.9)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        },
        "bounceSubtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" }
        },
        "glowPulse": {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(0, 212, 255, 0.3)",
            opacity: 0.7
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.6)",
            opacity: 1
          }
        },
        "gradientShift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        "marqueeReverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        // NOVAS SOMBRAS PREMIUM
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-yellow': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-neon': '0 0 30px rgba(0, 212, 255, 0.4)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        // NOVOS GRADIENTES PREMIUM
        'gradient-agro': 'linear-gradient(135deg, #16a34a 0%, #f59e0b 50%, #00d4ff 100%)',
        'gradient-sustainability': 'linear-gradient(135deg, #16a34a 0%, #14b8a6 100%)',
        'gradient-wealth': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-tech': 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
        'gradient-earth': 'linear-gradient(135deg, #a18072 0%, #8b5cf6 100%)',
        'gradient-premium': 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
      }
    },
  },
  plugins: [],
}
