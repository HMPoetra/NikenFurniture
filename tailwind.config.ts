import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf6ee",
          100: "#f9e8d0",
          200: "#f3cea0",
          300: "#ecad64",
          400: "#e58a36",
          500: "#d4701c",
          600: "#b85614",
          700: "#963f14",
          800: "#7a3318",
          900: "#642b16",
          950: "#3a1409",
        },
        dark: {
          DEFAULT: "#1a1510",
          800: "#2c241b",
          700: "#3d3328",
          600: "#5a4a35",
        },
        cream: {
          DEFAULT: "#f8f3ec",
          dark: "#ede5d8",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-raleway)", "sans-serif"],
      },
      backgroundImage: {
        "wood-pattern": "url('/images/wood-texture.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
