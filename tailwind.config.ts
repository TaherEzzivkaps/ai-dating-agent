import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#131315",
          dim: "#131315",
          bright: "#39393b",
          container: {
            lowest: "#0e0e10",
            low: "#1c1b1d",
            DEFAULT: "#201f22",
            high: "#2a2a2c",
            highest: "#353437",
          },
        },
        primary: {
          DEFAULT: "#d0bcff",
          container: "#a078ff",
          fixed: "#e9ddff",
          dim: "#d0bcff",
          accent: "#8b5cf6",
        },
        secondary: {
          DEFAULT: "#ffb2b7",
          container: "#b50036",
          fixed: "#ffdadb",
          dim: "#ffb2b7",
          accent: "#f43f5e",
        },
        tertiary: {
          DEFAULT: "#4edea3",
          container: "#00a572",
          fixed: "#6ffbbe",
          dim: "#4edea3",
          accent: "#10b981",
        },
        "on-surface": {
          DEFAULT: "#e5e1e4",
          variant: "#cbc3d7",
        },
        outline: {
          DEFAULT: "#958ea0",
          variant: "#494454",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
      },
      spacing: {
        gutter: "1.25rem",
        "gutter-mobile": "0.75rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Geist'", "sans-serif"],
        display: ["'Geist'", "'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
