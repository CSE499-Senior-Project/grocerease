import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      colors: {
        brand: {
          primary: "#16a34a",   // Fresh Green (Main Buttons)
          light: "#dcfce7",     // Soft Sage (Pill backgrounds)
          dark: "#15803d",      // Deep Green (Hover states)
        },
        accent: {
          DEFAULT: "#f59e0b",   // Organic Amber (Badges/Stars)
        },
        surface: {
          DEFAULT: "#ffffff",   // Pure white for product cards
          background: "#f8fafc",// Crisp off-white app background
        }
      },
    },
  },
  plugins: [],
};
export default config;