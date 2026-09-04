/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f6',
          500: '#0e8ce4',
          600: '#026fc3',
          700: '#03589e',
          800: '#074b82',
          900: '#0b3f6d',
          950: '#072847',
        },
        primary: {
          DEFAULT: '#0b3f6d',
          dark: '#072847',
          light: '#0e8ce4',
        },
        accent: {
          blue: '#1d4ed8',
          green: '#10b981',
          orange: '#f97316',
          purple: '#8b5cf6',
          red: '#ef4444',
          yellow: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['FzPoppins', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['SpaceGrotesk', 'Space Grotesk', 'sans-serif'],
        title: ['SpaceGrotesk', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(14, 140, 228, 0.25)',
      }
    },
  },
  plugins: [],
}
