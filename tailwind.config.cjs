/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2192DD",
          "secondary": "#FFE066",
          "accent": "#56e19a",
          "neutral": "#8a93a1",
          "base-100": "#151d29",
          "info": "#9448BC",
          "success": "#21CC51",
          "warning": "#FF6154",
          "error": "#DE1C8D",
        },
      },
    ],
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        bg_f_light: "#151d29",
        bg_dark_m: "#10161f",
        bg_darkest: "#0c111a",
        primary: "#2192dd",
        dividers: "#2B313A",
        t_dark: "#8a93a1",
        b_dark: "#202b3b",
        green_accent: "#56e19a",
        readable: "#efefef"
      },
      fontFamily:{
        sans:['"Lexend"', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [require('daisyui')],
};
