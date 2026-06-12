/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F8F5EE", deep: "#ECE6D7" },
        line: "#E8E0CD",
        ink: { DEFAULT: "#221B10", soft: "#5D5340", mute: "#998B6F" },
        gold: {
          50: "#FBF7EC",
          100: "#F5ECD6",
          200: "#EADBAE",
          300: "#DDC684",
          400: "#CFAE5B",
          500: "#BC9440",
          600: "#A37C33",
          700: "#85622B",
          800: "#6C4F26",
          900: "#594120",
        },
        espresso: { 700: "#3A2D1B", 800: "#2A2013", 900: "#1C150B" },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(35,28,17,0.05), 0 10px 30px -18px rgba(35,28,17,0.20)",
        lift: "0 18px 40px -18px rgba(35,28,17,0.38)",
        goldglow: "0 10px 26px -10px rgba(163,124,51,0.55)",
      },
      keyframes: {
        rise: {
          from: { transform: "translateY(26px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        pop: {
          "0%": { transform: "scale(.55)", opacity: "0" },
          "70%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        rise: "rise .34s cubic-bezier(.21,.85,.36,1) both",
        fade: "fade .25s ease both",
        pop: "pop .4s cubic-bezier(.2,.9,.3,1.35) both",
      },
    },
  },
  plugins: [],
};
