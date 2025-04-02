export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-primary': '#45B5AA',
        'custom-secondary': '#E6D2AA',
        'custom-accent': '#F87575',
        'custom-olive': '#A4B494',
        'custom-blue': '#1D3557',
      },
    },
    fontFamily: {
      playfair: ['var(--font-playfair-display)'],
      labGrotesque: ['var(--font-lab-grotesque)'],
    },
  },
  plugins: [],
}
