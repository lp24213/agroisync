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
          'bg-card': 'rgba(255, 255, 255, 0.9)',
          'bg-card-hover': 'rgba(248, 250, 252, 0.95)',
          'text-primary': '#1e293b',
          'text-secondary': '#475569',
          'text-tertiary': '#64748b',
          'border-primary': 'rgba(30, 41, 59, 0.1)',
          'border-accent': 'rgba(34, 197, 94, 0.3)',
          'accent-primary': '#22c55e', // Verde agro sofisticado
          'accent-secondary': '#f59e0b', // Dourado metálico sutil
          'accent-tertiary': '#8b5a2b', // Marrom terra suave
          'glass-bg': 'rgba(255, 255, 255, 0.8)',
        },
        // Tema Escuro - Futurista com fundo preto fosco (só quando ativado)
        'dark': {
          'bg-primary': '#0a0a0a',
          'bg-secondary': '#111111',
          'bg-card': 'rgba(17, 17, 17, 0.8)',
          'bg-card-hover': 'rgba(26, 26, 26, 0.9)',
          'text-primary': '#ffffff',
          'text-secondary': '#e5e5e5',
          'text-tertiary': '#a3a3a3',
          'border-primary': 'rgba(255, 255, 255, 0.1)',
          'border-accent': 'rgba(0, 212, 255, 0.3)',
          'accent-primary': '#00d4ff',
          'accent-secondary': '#8b5cf6',
          'accent-tertiary': '#ec4899',
          'glass-bg': 'rgba(17, 17, 17, 0.7)',
        },
        // Cores específicas do agro
        'agro': {
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
        // Cores de suporte para o tema claro
        'earth': {
          '50': '#fefce8',
          '100': '#fef9c3',
          '200': '#fef08a',
          '300': '#fde047',
          '400': '#facc15',
          '500': '#f59e0b',
          '600': '#d97706',
          '700': '#b45309',
          '800': '#92400e',
          '900': '#78350f',
        },
        'sky': {
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "starfield": "starfield 20s linear infinite",
        "meteor": "meteor 3s linear infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
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
          "50%": { transform: "translateY(-20px)" }
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.8)" }
        },
        "starfield": {
          "0%": { transform: "translateZ(0px)" },
          "100%": { transform: "translateZ(1000px)" }
        },
        "meteor": {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
          "70%": { opacity: 1 },
          "100%": { transform: "rotate(215deg) translateX(-500px)", opacity: 0 }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'metallic': '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
