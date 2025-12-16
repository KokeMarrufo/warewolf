/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: '#1a1a2e',
        moon: '#eee',
        blood: '#e63946',
        forest: '#2d6a4f',
      }
    },
  },
  plugins: [],
}

