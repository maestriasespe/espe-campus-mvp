import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espe: {
          bg: "var(--espe-bg)",
          bg2: "var(--espe-bg2)",
          gold: "var(--espe-gold)",
          gold2: "var(--espe-gold2)",
          text: "var(--espe-text)",
          muted: "var(--espe-muted)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
