/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './sections/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      // Mobile-first breakpoints
      'xs': '320px',    // Extra small devices (small phones)
      'sm': '640px',    // Small devices (large phones)
      'md': '768px',    // Medium devices (tablets)
      'lg': '1024px',   // Large devices (laptops)
      'xl': '1280px',   // Extra large devices (desktops)
      '2xl': '1536px',  // 2X large devices (large desktops)
      
      // Custom breakpoints for specific needs
      'mobile': '480px',     // Custom mobile breakpoint
      'tablet': '768px',     // Custom tablet breakpoint
      'laptop': '1024px',    // Custom laptop breakpoint
      'desktop': '1280px',   // Custom desktop breakpoint
      'wide': '1440px',      // Wide screens
      'ultrawide': '1920px', // Ultra wide screens
      
      // Max-width breakpoints (for when you need max-width media queries)
      'max-xs': {'max': '319px'},
      'max-sm': {'max': '639px'},
      'max-md': {'max': '767px'},
      'max-lg': {'max': '1023px'},
      'max-xl': {'max': '1279px'},
      'max-2xl': {'max': '1535px'},
      
      // Range breakpoints (for specific ranges)
      'sm-md': {'min': '640px', 'max': '767px'},
      'md-lg': {'min': '768px', 'max': '1023px'},
      'lg-xl': {'min': '1024px', 'max': '1279px'},
      
      // Height-based breakpoints (useful for hero sections)
      'h-sm': {'raw': '(min-height: 640px)'},
      'h-md': {'raw': '(min-height: 768px)'},
      'h-lg': {'raw': '(min-height: 1024px)'},
      
      // Orientation breakpoints
      'portrait': {'raw': '(orientation: portrait)'},
      'landscape': {'raw': '(orientation: landscape)'},
      
      // Device-specific breakpoints
      'phone': {'raw': '(max-width: 767px)'},
      'tablet-up': {'raw': '(min-width: 768px)'},
      'desktop-up': {'raw': '(min-width: 1024px)'},
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        lavender: '#E4D9FF',
        'soft-peach': '#FFF1F1',
        mint: '#AEE1D5',
        coral: '#FADADD',
        'dusty-plum': '#D7A9E3',
        'light-gray': '#EDEDED',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
      },
    },
  },
  plugins: [],
} 