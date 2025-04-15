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
        sans: ["Jost-Regular", "system-ui", "sans-serif"],
        jost: ["Jost-Regular", "system-ui", "sans-serif"],
        montserrat: ["Montserrat-Bold", "system-ui", "sans-serif"],
        // Weight-specific Jost fonts
        "jost-regular": ["Jost-Regular", "system-ui", "sans-serif"],
        "jost-medium": ["Jost-Medium", "system-ui", "sans-serif"],
        "jost-semibold": ["Jost-SemiBold", "system-ui", "sans-serif"],
        "jost-bold": ["Jost-Bold", "system-ui", "sans-serif"],
        "jost-black": ["Jost-Black", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
