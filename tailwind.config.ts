import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0B1630",
        gold: "#C8A24A",
        maroon: "#6B0F1A",
      }
    },
  },
  plugins: [],
};
export default config;
