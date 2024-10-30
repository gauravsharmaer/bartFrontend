/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "3xl": "3840px",
        "5xl": "5120px",
      },
    },
  },
  plugins: [],
};
