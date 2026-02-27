import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/theme/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        surface: {
          primary: 'rgb(var(--theme-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--theme-bg-tertiary) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--theme-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--theme-text-tertiary) / <alpha-value>)',
          inverted: 'rgb(var(--theme-text-inverted) / <alpha-value>)',
        },
        edge: {
          primary: 'rgb(var(--theme-border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--theme-border-secondary) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};

export default config;
