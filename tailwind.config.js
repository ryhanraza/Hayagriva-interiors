module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C4A265',
          light: '#F5EFE6',
          dark: '#9E7E45',
        },
        beige: '#F6F0E6',
        charcoal: '#1A1917',
        warmcream: '#FAF8F5',
        softgrey: '#8A8885'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
}
