module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00f0ff', // Azul neon
        accent: '#0ff1ce', // Verde neon
        secondary: '#a259ff', // Roxo neon
        background: '#080818', // Preto fosco
        backgroundDark: '#0a0a0a',
        surface: '#151522',
        glass: 'rgba(20, 20, 30, 0.65)',
        glassLight: 'rgba(40, 40, 60, 0.3)',
        glassUltra: 'rgba(0,240,255,0.10)',
        white: '#e0e0e0',
        black: '#000',
        border: '#22223a',
        highlight: '#fffbe6',
        error: '#ff3860',
        success: '#00ffb2',
        warning: '#ffe066',
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        neon: '0 0 8px #00f0ff, 0 0 16px #00f0ff',
        neonPurple: '0 0 8px #a259ff, 0 0 16px #a259ff',
        neonGreen: '0 0 8px #0ff1ce, 0 0 16px #0ff1ce',
        glassStrong: '0 8px 64px 0 rgba(0,240,255,0.15)',
        glassInset: 'inset 0 1.5px 16px 0 rgba(0,240,255,0.10)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass':
          'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(8,8,24,0.95) 100%)',
        'gradient-neon': 'linear-gradient(90deg, #00f0ff 0%, #0ff1ce 50%, #a259ff 100%)',
        'gradient-neon-reverse': 'linear-gradient(90deg, #a259ff 0%, #0ff1ce 50%, #00f0ff 100%)',
        'gradient-hero': 'linear-gradient(120deg, #00f0ff 0%, #0ff1ce 60%, #a259ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #080818 0%, #151522 100%)',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 8px #00f0ff, 0 0 16px #00f0ff' },
          '50%': { boxShadow: '0 0 16px #00f0ff, 0 0 32px #00f0ff' },
        },
      },
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
