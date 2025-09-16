/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Design System - Tesla + Solana inspired
        // Preto fosco base
        'matte-black': '#0a0a0a',
        'matte-black-light': '#1a1a1a',
        'matte-black-lighter': '#2a2a2a',
        'matte-black-lightest': '#3a3a3a',
        
        // Azul neon
        'neon-blue': '#00d4ff',
        'neon-blue-dark': '#0099cc',
        'neon-blue-light': '#33ddff',
        'neon-blue-glow': 'rgba(0, 212, 255, 0.3)',
        
        // Dourado leve
        'light-gold': '#ffd700',
        'light-gold-dark': '#ccac00',
        'light-gold-light': '#ffe033',
        'light-gold-glow': 'rgba(255, 215, 0, 0.3)',
        
        // Cores de apoio premium
        'premium-white': '#ffffff',
        'premium-gray': '#f8fafc',
        'premium-gray-dark': '#64748b',
        'premium-gray-darker': '#334155',
        
        // Cores de status
        'success': '#00ff88',
        'success-glow': 'rgba(0, 255, 136, 0.3)',
        'danger': '#ff4757',
        'danger-glow': 'rgba(255, 71, 87, 0.3)',
        'warning': '#ffa502',
        'warning-glow': 'rgba(255, 165, 2, 0.3)',
        
        // Glass effect colors
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-black': 'rgba(0, 0, 0, 0.3)',
        'glass-neon': 'rgba(0, 212, 255, 0.1)',
        'glass-gold': 'rgba(255, 215, 0, 0.1)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'gradient': 'gradient 15s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': `
          linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'cyber-grid': '50px 50px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 212, 255, 0.5)',
        'neon-lg': '0 0 40px rgba(0, 212, 255, 0.6)',
        'neon-xl': '0 0 60px rgba(0, 212, 255, 0.7)',
        'gold': '0 0 20px rgba(255, 215, 0, 0.5)',
        'gold-lg': '0 0 40px rgba(255, 215, 0, 0.6)',
        'gold-xl': '0 0 60px rgba(255, 215, 0, 0.7)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'premium': '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'premium-lg': '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}