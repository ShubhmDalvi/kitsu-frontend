module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'kitsu-ink': '#896C6C',
        'kitsu-rose': '#E5BEB5',
        'kitsu-sand': '#EEE6CA',
        'kitsu-mint': '#F5FAE1',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        logo: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
