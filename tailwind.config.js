/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#7940C8',
        'soft-purple': '#C9A9FF',
        'persian-pink': '#FF8AD8',
        'jasmine-yellow': '#FFE981',
        'light-sky-blue': '#7EC8F5',
        'light-pink': '#F8EDF7',
        'pink': '#FFD4F1',
        'yellow': '#FFEE9F',
        'purple': '#C9A9FF',
        'cream': '#F6EDC1',
        'beige': '#FFFBE6',
        'dark': '#1E1E1E',
        'blue': '#116FA8',
      },
      fontFamily: {
        'jomhuria': ['Jomhuria', 'cursive'],
      },
    },
  },
  plugins: [],
}

