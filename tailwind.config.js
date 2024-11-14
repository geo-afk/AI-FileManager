/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#77D1F3',
        aside: '#0B76B7',
        'acrylic-blue': 'rgba(0, 120, 215, 0.6)', // a translucent blue
        'acrylic-dark-blue': 'rgba(32, 64, 96, 0.8)', // deeper blue
        'acrylic-white': 'rgba(255, 255, 255, 0.2)', // subtle white for highlights
        'acrylic-gray': 'rgba(0, 0, 0, 0.2)' // translucent dark gray
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      }
    }
  },
  plugins: []
}
