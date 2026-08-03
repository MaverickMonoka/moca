import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#111417',
          light: '#1A1F23',
          lighter: '#242A2F',
        },
        moca: {
          green: '#00A651',
          'green-dark': '#00803F',
          'green-light': '#2ECC71',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C766',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'moca-gradient': 'linear-gradient(135deg, #00A651 0%, #00803F 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #E8C766 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 40px -10px rgba(0, 166, 81, 0.4)',
        'glow-gold': '0 0 40px -10px rgba(212, 175, 55, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        ticker: 'ticker 32s linear infinite',
        'draw-line': 'draw-line 2.2s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config
