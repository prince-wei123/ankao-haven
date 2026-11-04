/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#faf6f1',
        paper2: '#f3ede3',
        paper3: '#e6ddcd',
        ink: '#2a241e',
        ink2: '#5a4f42',
        ink3: '#8d8274',
        accent: {
          DEFAULT: '#c17b5c',
          light: '#e8b49a',
          dark: '#8f553c'
        },
        gold: '#b5833d',
        sage: '#7a9e8a',
        lilac: '#8a7ba1',
        steel: '#5a6d82',
        rose: '#a46868'
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Playfair Display"', 'serif'],
        display: ['"Playfair Display"', '"Noto Serif SC"', 'serif'],
        sans: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Consolas', 'monospace']
      },
      boxShadow: {
        soft: '0 2px 12px rgba(100, 70, 40, 0.06)',
        card: '0 8px 32px rgba(100, 70, 40, 0.08)',
        cardHover: '0 12px 40px rgba(100, 70, 40, 0.14)',
        glow: '0 0 60px rgba(193, 123, 92, 0.18)'
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
