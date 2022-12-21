/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        bg_f_light: "#171d28",
        bg_dark_m: "#0c161e",
        primary: "#2192dd"
      },
      fontFamily:{
        sans:['"Lexend"', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [],
};
