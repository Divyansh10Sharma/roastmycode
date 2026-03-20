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
        mono: ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        flame: "#FF4500",
        ember: "#FF6B35",
        ash: "#1A1A1A",
        smoke: "#2D2D2D",
        cinder: "#3D3D3D",
      },
      animation: {
        "flicker": "flicker 3s infinite",
        "slide-up": "slideUp 0.6s ease forwards",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;