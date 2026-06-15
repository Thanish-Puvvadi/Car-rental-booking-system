/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#f59e0b',  // Amber 500
          DEFAULT: '#d97706',// Amber 600
          dark: '#b45309',   // Amber 700
        },
        primary: {
          light: '#4f46e5',  // Indigo 600
          DEFAULT: '#3730a3',// Indigo 800
          dark: '#1e1b4b',   // Indigo 950
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
