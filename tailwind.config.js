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
          50: '#f0f9f4',
          100: '#dcf1e5',
          200: '#bce4cd',
          300: '#8ecea9',
          400: '#55b37f',
          500: '#26955c',
          600: '#127b4b',
          700: '#006039', // Official Rolex Green
          800: '#044d2e',
          900: '#023821',
          950: '#012616',
        },
        primary: {
          DEFAULT: '#006039', // Rolex Green
          dark: '#00472a',
          light: '#127b4b',
          rolex: '#006039',
          lacoste: '#002b1b',
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
        sans: ["'Be Vietnam Pro'", 'Poppins', 'Arial', 'sans-serif'],
        body: ["'Be Vietnam Pro'", 'Poppins', 'Arial', 'sans-serif'],
        poppins: ["'Be Vietnam Pro'", 'Poppins', 'Arial', 'sans-serif'],
        heading: ['"Space Grotesk"', 'SpaceGrotesk', 'sans-serif'],
        title: ['"Space Grotesk"', 'SpaceGrotesk', 'sans-serif'],
        hero: ['"Space Grotesk"', 'SpaceGrotesk', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'SpaceGrotesk', 'sans-serif'],
        arial: ["'Be Vietnam Pro'", 'Poppins', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.725rem', { lineHeight: '1rem' }],
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],  /* ~13px (was 12px) */
        'sm': ['0.9375rem', { lineHeight: '1.45rem' }],  /* ~15px (was 14px) */
        'base': ['1.05rem', { lineHeight: '1.68rem' }],   /* ~16.8px (was 16px) */
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
