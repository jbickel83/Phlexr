import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        gold: "#e6b33a",
        "gold-soft": "#f2cd73",
        ivory: "#f5f1e8",
      },
    },
  },
  plugins: [],
};

export default config;
