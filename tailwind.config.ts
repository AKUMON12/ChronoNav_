import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
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
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        brand: {
          primary: "#1D7DD7",
          secondary: "#507495",
          dark: "#0E151B",
          muted: "#74777E",
          light: "#F8FAFB",
          border: "#E8EDF3",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-noto-sans)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        noto: ["var(--font-noto-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
