import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bs: "#202c33",
        bgchat: "#2a3942",
        bgtime: "#182229",
        bgmess: "#005c4b",
        bgsearch: "#111b21",
        iconnav: "#aebac1",
        ts: {
          "950": "#f3f8f8",
          "900": "#e0ebed",
          "800": "#c4d9dd",
          "700": "#9bbcc5",
          "600": "#6a99a6",
          "500": "#4f7d8b",
          "400": "#446876",
          "300": "#3c5762",
          "200": "#374a53",
          "100": "#314048",
          "50": "#202c33",
          DEFAULT: "#202c33",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "#FFD34E",
            secondary: "#EE457E",
            background: "#F4E8D1",
          },
        },
        dark: {
          colors: {
            default: {
              "50": " #314048",
              "100": "#374a53",
              "200": "#3c5762",
              "300": "#446876",
              "400": "#4f7d8b",
              "500": "#6a99a6",
              "600": "#9bbcc5",
              "700": "#c4d9dd",
              "800": "#e0ebed",
              "900": "#f3f8f8",
              DEFAULT: "#202c33",
            },
            primary: {
              "50": "#012d28",
              "100": "#045044",
              "200": "#036251",
              "300": "#008069",
              "400": "#009b7b",
              "500": "#0abf96",
              "600": "#2fd8ac",
              "700": "#6aebc6",
              "800": "#a4f6d9",
              "900": "#d0fbea",
              DEFAULT: "#005c4b",
            },
            background: "#0c1317",
          },
        },
      },
    }),
  ],
};
export default config;
