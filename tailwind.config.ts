import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
    "./product/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./studio/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],

  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1440px"
        }
      },

      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",

        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",

        accent: "var(--color-accent)",

        border: "var(--color-border)",

        muted: "var(--color-muted)",

        card: "var(--color-card)",

        destructive: "var(--color-destructive)"
      },

      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)"
      },

      boxShadow: {
        luxury: "var(--shadow-luxury)"
      },

      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"]
      },

      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22,1,0.36,1)"
      }
    }
  },

  plugins: []
};

export default config;
