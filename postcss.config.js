/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0F3D91',
          gold: '#D4AF37',
          goldHover: '#B8972C',
          dark: '#0B0F19',
          cardDark: '#111827',
          charcoal: '#1A1A1A',
          offWhite: '#F8F8F8'
        }
      }
    }
  },
  plugins: []
}