/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFAF5',
          100: '#FAF5EE',
          200: '#F5EAD8',
          300: '#EDD9BE',
          400: '#D4B896',
          500: '#B89870',
        },
        orange: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
        },
        warm: {
          dark:  '#2C1A0E',
          brown: '#6B4C2A',
          mid:   '#A0724A',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s infinite',
        'pulse-warm': 'pulse-warm 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-warm': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      backgroundImage: {
        'warm-gradient':   'linear-gradient(135deg, #FAF5EE 0%, #FFF0DC 50%, #FAF5EE 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)',
        'hero-gradient':   'linear-gradient(160deg, #FFF7ED 0%, #FFEDD5 40%, #FAF5EE 100%)',
      },
      boxShadow: {
        'warm-sm':    '0 2px 8px rgba(249,115,22,0.12)',
        'warm-md':    '0 4px 20px rgba(249,115,22,0.18)',
        'warm-lg':    '0 8px 40px rgba(249,115,22,0.22)',
        'warm-xl':    '0 16px 60px rgba(249,115,22,0.28)',
        'card':       '0 2px 16px rgba(44,26,14,0.08)',
        'card-hover': '0 8px 32px rgba(44,26,14,0.14)',
      },
    },
  },
  plugins: [],
}
