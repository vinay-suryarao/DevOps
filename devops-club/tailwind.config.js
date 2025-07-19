/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#243B53',
        secondary: '#4C8098',
        accent: '#FF6B3E',
        light: '#D9D9D9',
      },
    },
  },
  plugins: [],
}
