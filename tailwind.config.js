/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#fdfbf7',
        'paper-dark': '#f0ebe0',
        'ink': '#2d2d2d',
        'ink-muted': '#7a7060',
        'ink-faint': '#c8bfaa',
        'marker-cyan': '#00c8e8',
        'marker-red': '#ff4d4d',
        'marker-blue': '#2d5da1',
        'post-it': '#fff9c4'
      },
      fontFamily: {
        display: ['Kalam', 'cursive'],
        body: ['Patrick Hand', 'cursive'],
        mono: ['Special Elite', 'cursive']
      },
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))'
      }
    }
  },
  plugins: []
}