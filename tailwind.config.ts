import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'mea-cream':  '#FFF4DE',
        'mea-gold':   '#F5D482',
        'mea-taupe':  '#9E906C',
        'mea-sage':   '#889177',
        'mea-rust':   '#853710',
        'mea-pearl':  '#FFF4DE',
        'mea-earth':  '#9E906C',
      },
      fontFamily: {
        sans: ["'Geom'", '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'geom': ["'Geom'", 'sans-serif'],
        'bellota': ["'Bellota Text'", 'sans-serif'],
        'new-hero': ["'New Hero'", '-apple-system', 'sans-serif'],
        'warbler': ["'Warbler Banner'", 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
