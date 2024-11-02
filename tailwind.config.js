/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main': '#77D1F3',
        'aside': '#0B76B7',
      },
    },
  },
  plugins: [],
}

