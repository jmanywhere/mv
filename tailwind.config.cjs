/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        sans:['"Lexen"', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [],
};
