/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#7c5dfa",
        darkBG: "#141625",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
