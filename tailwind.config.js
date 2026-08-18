/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#090806',
        'obsidian': '#12100C',
        'ancient-red': '#7A1717',
        'vermilion': '#B52B21',
        'imperial-gold': '#C89B3C',
        'bright-gold': '#F0D27A',
        'jade': '#567A64',
        'dark-jade': '#1D3930',
        'aged-paper': '#DCC38E',
        'ivory': '#F5E8C6',
        'bronze': '#74532B',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'cinzel-deco': ['Cinzel Decorative', 'serif'],
        'noto-serif': ['Noto Serif', 'serif'],
        'noto-sans': ['Noto Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'scroll-unfurl': 'scrollUnfurl 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'particle-drift': 'particleDrift var(--duration, 8s) ease-in-out infinite',
        'ink-spread': 'inkSpread 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'seal-stamp': 'sealStamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'seal-glow': 'sealGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.3)' },
        },
        scrollUnfurl: {
          '0%': { clipPath: 'inset(50% 0 50% 0)', opacity: '0' },
          '100%': { clipPath: 'inset(0% 0 0% 0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px) rotateX(10deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(0deg)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        particleDrift: {
          '0%': { transform: 'translateY(100vh) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-20vh) translateX(var(--drift, 30px))', opacity: '0' },
        },
        inkSpread: {
          '0%': { clipPath: 'circle(0% at 50% 50%)', opacity: '0' },
          '100%': { clipPath: 'circle(150% at 50% 50%)', opacity: '1' },
        },
        sealStamp: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        sealGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(180, 43, 33, 0.4)' },
          '50%': { boxShadow: '0 0 35px rgba(200, 155, 60, 0.7), 0 0 60px rgba(180, 43, 33, 0.3)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #74532B 0%, #C89B3C 30%, #F0D27A 50%, #C89B3C 70%, #74532B 100%)',
        'parchment': 'radial-gradient(ellipse at center, #F5E8C6 0%, #DCC38E 40%, #C4A96E 80%, #B09050 100%)',
        'ink-bg': 'radial-gradient(ellipse at 50% 100%, #1D1208 0%, #0F0C08 50%, #090806 100%)',
      },
    },
  },
  plugins: [],
}
