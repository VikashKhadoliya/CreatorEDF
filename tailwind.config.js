/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
    "./src/context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ECFDF5",   // Soft mint green
          100: "#D1FAE5",  // Pill background
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",  // Emerald accent
          600: "#059669",  // Primary brand green
          700: "#047857",  // Deep green text
          800: "#065F46",
          900: "#064E3B",
        },
        navy: {
          900: "#111827", // Dark neutral text
          800: "#1F2937",
          700: "#374151",
          600: "#4B5563",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50:  "#F9FAFB",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

