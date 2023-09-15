/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink:{
          'light': '#EEDADB',
          'default': '#D9ABAB',
          'dark': '#AA7474',
        },
      },  
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Great Vibes', 'serif'],
    },
  },
  plugins: [],
}

