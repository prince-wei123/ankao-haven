/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#fdf2f5',
        paper2: '#f9e4eb',
        paper3: '#f0cfda',
        ink: '#2c2128',
        ink2: '#5b4753',
        ink3: '#917c87',
        accent: {
          DEFAULT: '#d1738f',
          light: '#f2b3c6',
          dark: '#a04a66'
        },
        gold: '#c08a8f',
        sage: '#7a9e8a',
        lilac: '#8a7ba1',
        steel: '#5a6d82',
        rose: '#b8607a'
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Playfair Display"', 'serif'],
        display: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
        sans: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'monospace']
      },
      boxShadow: {
        soft: '0 2px 12px rgba(160, 74, 102, 0.06)',
        card: '0 8px 32px rgba(160, 74, 102, 0.09)',
        cardHover: '0 12px 40px rgba(160, 74, 102, 0.16)',
        glow: '0 0 60px rgba(209, 115, 143, 0.20)'
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
        'slide-in': 'slideIn 0.4s ease-out'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
