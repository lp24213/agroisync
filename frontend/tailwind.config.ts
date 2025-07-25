/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00f0ff', // azul neon
        background: '#0a0a0a', // preto fosco
        accent: '#0ff1ce',
        glass: 'rgba(20, 20, 30, 0.6)',
        glassLight: 'rgba(40, 40, 60, 0.3)',
      },
      fontFamily: {
        futuristic: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        neon: '0 0 8px #00f0ff, 0 0 16px #00f0ff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass':
          'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(10,10,10,0.95) 100%)',
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
