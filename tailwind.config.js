/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A73E8",
          dark: "#4A9EFF",
          hover: "#1557B0",
          light: "#E8F0FE",
        },
        background: {
          DEFAULT: "#F8F9FA",
          dark: "#121212",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1E1E1E",
        },
        foreground: {
          DEFAULT: "#202124",
          dark: "#E8EAED",
        },
        muted: {
          DEFAULT: "#5F6368",
          dark: "#9AA0A6",
          light: "#F1F3F4",
        },
        border: {
          DEFAULT: "#E8EAED",
          dark: "#2D2D2D",
        },
        success: {
          DEFAULT: "#34A853",
          dark: "#4ADE80",
          light: "#E6F4EA",
        },
        warning: {
          DEFAULT: "#FBBC04",
          dark: "#FBBF24",
          light: "#FEF7E0",
        },
        error: {
          DEFAULT: "#EA4335",
          dark: "#F87171",
          light: "#FCE8E6",
        },
      },
    },
  },
  plugins: [],
};
