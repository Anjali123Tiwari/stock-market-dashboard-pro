
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1220",
        panel: "#121a2a",
        card: "#0f1726",
        accent: "#60a5fa"
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
