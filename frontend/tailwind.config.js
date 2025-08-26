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
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
