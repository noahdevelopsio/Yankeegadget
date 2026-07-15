import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF3D00",
          "orange-light": "#FF7A33",
        },
        ink: {
          900: "#0B0B0F",
          700: "#3A3A42",
          400: "#8A8A94",
        },
        surface: "#FFFFFF",
        "surface-alt": "#F6F6F8",
        border: "#E7E7EB",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
