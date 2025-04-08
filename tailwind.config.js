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
    },
  },
  plugins: [],
};
