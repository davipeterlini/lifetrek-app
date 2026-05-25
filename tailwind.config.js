export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: { xs: "475px" },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14B8A6",
          600: "#0d9488",
          700: "#0f766e",
        },
        emerald: {
          500: "#10B981",
          600: "#059669",
        },
      },
    },
  },
  plugins: [],
};