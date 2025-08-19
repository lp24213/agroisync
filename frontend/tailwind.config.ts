import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores roxo prateado perfeitas
        'purple-silver': {
          50: '#f8f7ff',
          100: '#f0eeff',
          200: '#e6e2ff',
          300: '#d4ccff',
          400: '#b8a6ff',
          500: '#9b7cff',
          600: '#7c5aff',
          700: '#6b46c1',
          800: '#553c9a',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Cores cósmicas
        'cosmic': {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          indigo: '#6366f1',
        },
        // Cores de fundo cósmicas
        'bg': {
          primary: '#0f0f23',
          secondary: '#1a1a2e',
          tertiary: '#16213e',
          accent: '#0f3460',
        },
        // Cores de texto cósmicas
        'text': {
          primary: '#ffffff',
          secondary: '#e2e8f0',
          muted: '#94a3b8',
        },
        // Cores de borda cósmicas
        'border': {
          primary: 'rgba(139, 92, 246, 0.3)',
          secondary: 'rgba(59, 130, 246, 0.2)',
          accent: 'rgba(6, 182, 212, 0.4)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cosmic-gradient': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
        'purple-silver-gradient': 'linear-gradient(135deg, #f8f7ff 0%, #e6e2ff 25%, #b8a6ff 50%, #9b7cff 75%, #7c5aff 100%)',
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 8s ease-in-out infinite',
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'cosmic-pulse': 'cosmic-pulse 4s ease-in-out infinite',
        'nebula-drift': 'nebula-drift 20s linear infinite',
        'star-shower': 'star-shower 8s linear infinite',
        'quantum-orbital': 'quantum-orbital 12s linear infinite',
        'cosmic-wave': 'cosmic-wave 15s ease-in-out infinite',
        'stellar-rotation': 'stellar-rotation 18s linear infinite',
        'particle-explosion': 'particle-explosion 2s ease-out infinite',
        'cosmic-float': 'cosmic-float 10s ease-in-out infinite',
        'energy-pulse': 'energy-pulse 3s ease-in-out infinite',
        'holographic-shimmer': 'holographic-shimmer 4s ease-in-out infinite',
        'quantum-tunnel': 'quantum-tunnel 6s ease-in-out infinite',
        'star-field': 'star-field 20s linear infinite',
      },
      keyframes: {
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) rotate(5deg)' },
          '50%': { transform: 'translateY(-40px) rotate(0deg)' },
          '75%': { transform: 'translateY(-20px) rotate(-5deg)' }
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(20px) rotate(-5deg)' },
          '50%': { transform: 'translateY(40px) rotate(0deg)' },
          '75%': { transform: 'translateY(20px) rotate(5deg)' }
        },
        'sparkle': {
          '0%, 100%': { 
            opacity: '0', 
            transform: 'scale(0) rotate(0deg)', 
            filter: 'brightness(1) hue-rotate(0deg)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.2) rotate(180deg)', 
            filter: 'brightness(1.5) hue-rotate(180deg)' 
          }
        },
        'cosmic-pulse': {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)', 
            filter: 'brightness(1) hue-rotate(0deg)' 
          },
          '25%': { 
            transform: 'scale(1.1) rotate(90deg)', 
            filter: 'brightness(1.3) hue-rotate(90deg)' 
          },
          '50%': { 
            transform: 'scale(1.2) rotate(180deg)', 
            filter: 'brightness(1.6) hue-rotate(180deg)' 
          },
          '75%': { 
            transform: 'scale(1.1) rotate(270deg)', 
            filter: 'brightness(1.3) hue-rotate(270deg)' 
          }
        },
        'nebula-drift': {
          '0%': { 
            transform: 'translateX(-100%) translateY(-100%) rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg) brightness(1)' 
          },
          '25%': { 
            transform: 'translateX(0%) translateY(-50%) rotate(90deg) scale(1.2)',
            filter: 'hue-rotate(90deg) brightness(1.3)' 
          },
          '50%': { 
            transform: 'translateX(100%) translateY(0%) rotate(180deg) scale(1)',
            filter: 'hue-rotate(180deg) brightness(1)' 
          },
          '75%': { 
            transform: 'translateX(50%) translateY(100%) rotate(270deg) scale(1.1)',
            filter: 'hue-rotate(270deg) brightness(1.2)' 
          },
          '100%': { 
            transform: 'translateX(-100%) translateY(-100%) rotate(360deg) scale(1)',
            filter: 'hue-rotate(360deg) brightness(1)' 
          }
        },
        'star-field': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-100px)' }
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        'cosmic': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cosmic-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
        'cosmic-xl': '0 0 60px rgba(139, 92, 246, 0.7)',
        'purple-silver': '0 0 20px rgba(124, 90, 255, 0.3)',
        'purple-silver-lg': '0 0 40px rgba(124, 90, 255, 0.5)',
        'purple-silver-xl': '0 0 60px rgba(124, 90, 255, 0.7)',
      }
    },
  },
  plugins: [],
}
export default config
