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
        brand: {
          primary: "#1D7DD7",
          secondary: "#507495",
          dark: "#0E151B",
          muted: "#74777E",
          light: "#F8FAFB",
          border: "#E8EDF3",
        },
        primary: {
          DEFAULT: "#1D7DD7",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#507495",
          foreground: "#FFFFFF",
        },
        dark: {
          DEFAULT: "#0E151B",
          foreground: "#F8FAFB",
        },
        muted: {
          DEFAULT: "#74777E",
          foreground: "#FFFFFF",
        },
        background: "#F8FAFB",
        surface: "#FFFFFF",
        border: "#E8EDF3",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
