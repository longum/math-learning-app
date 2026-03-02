/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#4CAF50',
          blue: '#2196F3',
        },
        light: {
          green: '#81C784',
          blue: '#64B5F6',
        },
        error: '#E57373',
        success: '#66BB6A',
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', '"Chalkboard SE"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
