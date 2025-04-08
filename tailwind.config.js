/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#874BF9",
        themeGreen: "#CCFE00",
        themeGrayDark: "#696969",
        themeGrayLight: "#D4D4D4",
      },
      fontFamily: {
        sans: ["Jost", "system-ui", "sans-serif"],
        jost: ["Jost", "system-ui", "sans-serif"],
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
