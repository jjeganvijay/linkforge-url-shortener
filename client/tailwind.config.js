/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        app: {
          DEFAULT: 'var(--app-bg)',
          raised: 'var(--app-raised)',
          card: 'var(--app-card)',
        },
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
        },
        heart: {
          rose: 'var(--heart-rose)',
          blush: 'var(--heart-blush)',
          coral: 'var(--heart-coral)',
          peach: 'var(--heart-peach)',
          gold: 'var(--heart-gold)',
        },
        accent: {
          warm: 'var(--accent-warm)',
          coral: 'var(--accent-coral)',
        },
      },
      boxShadow: {
        glow: 'var(--shadow-glow-pulse)',
        'glow-soft': 'var(--shadow-glow-soft)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.55s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.52' },
          '50%': { opacity: '0.72' },
        },
      },
    },
  },
  plugins: [],
};
