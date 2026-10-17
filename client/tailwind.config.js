/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#f2f8f3',
          100: '#e0efe3',
          200: '#c1dfc7',
          300: '#96c8a1',
          400: '#65aa76',
          500: '#428d56',
          600: '#307143',
          700: '#285a37',
          800: '#22482e',
          900: '#1c3b27',
          950: '#0d2116',
        },
        lime: {
          400: '#a6d84a',
          500: '#8fc233',
        },
        canvas: '#f6f8f4',
        ink: '#16221a',
        stem: '#5b6b60',
      },
      fontFamily: {
        display: ['"Manrope"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22, 34, 26, 0.04), 0 4px 16px rgba(22, 34, 26, 0.06)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
