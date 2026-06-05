import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070710",
        amber: { DEFAULT: "#FFB547", glow: "rgba(255,181,71,0.5)" },
        magenta: { DEFAULT: "#FF3D9A", glow: "rgba(255,61,154,0.5)" },
        cyan: { DEFAULT: "#4DE5FF", glow: "rgba(77,229,255,0.5)" },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        fraunces: ["Fraunces", "serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
