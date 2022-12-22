/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        bg_f_light: "#151d29",
        bg_dark_m: "#10161f",
        bg_darkest: "#0c111a",
        primary: "#2192dd"
      },
      fontFamily:{
        sans:['"Lexend"', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [],
};
