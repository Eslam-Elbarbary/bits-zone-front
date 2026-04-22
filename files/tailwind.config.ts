import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        modern:
          "0 1px 2px -1px rgb(15 23 42 / 0.06), 0 4px 16px -4px rgb(15 23 42 / 0.08)",
        "modern-lg":
          "0 4px 8px -2px rgb(15 23 42 / 0.06), 0 16px 32px -8px rgb(15 23 42 / 0.12)",
        "modern-inner": "inset 0 1px 0 0 rgb(255 255 255 / 0.65)",
        glow: "0 0 32px -6px rgb(14 165 233 / 0.35), 0 8px 24px -8px rgb(15 23 42 / 0.12)",
        "glow-papaya": "0 0 28px -4px rgb(251 146 60 / 0.4), 0 8px 20px -8px rgb(15 23 42 / 0.1)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        papaya: {
          DEFAULT: "var(--papaya)",
          foreground: "var(--papaya-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground, oklch(0.985 0 0))",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translate3d(0, 14px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "category-marquee": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "light-pulse": {
          "0%, 100%": { opacity: "0.28" },
          "50%": { opacity: "0.55" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translate3d(-100%, 0, 0)" },
          "100%": { transform: "translate3d(200%, 0, 0)" },
        },
        "rgb-glow": {
          "0%, 100%": {
            boxShadow:
              "0 14px 44px -14px rgb(59 130 246 / 0.42), 0 0 0 1px rgb(59 130 246 / 0.22)",
          },
          "25%": {
            boxShadow:
              "0 14px 44px -14px rgb(168 85 247 / 0.42), 0 0 0 1px rgb(168 85 247 / 0.22)",
          },
          "50%": {
            boxShadow:
              "0 14px 44px -14px rgb(236 72 153 / 0.42), 0 0 0 1px rgb(236 72 153 / 0.22)",
          },
          "75%": {
            boxShadow:
              "0 14px 44px -14px rgb(34 197 94 / 0.4), 0 0 0 1px rgb(34 197 94 / 0.2)",
          },
        },
        "glass-glint": {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "0.55" },
        },
        "animal-float-a": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(-6deg)" },
          "33%": { transform: "translate3d(10px, -16px, 0) rotate(5deg)" },
          "66%": { transform: "translate3d(-6px, -8px, 0) rotate(8deg)" },
        },
        "animal-float-b": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(5deg)" },
          "50%": { transform: "translate3d(-14px, -22px, 0) rotate(-8deg)" },
        },
        "animal-float-c": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(8px, -14px, 0) scale(1.07) rotate(-4deg)" },
        },
        "animal-waddle": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(-4deg)" },
          "25%": { transform: "translate3d(16px, -6px, 0) rotate(6deg)" },
          "75%": { transform: "translate3d(-10px, -12px, 0) rotate(-2deg)" },
        },
        "category-mesh-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(3%, -2%, 0) scale(1.04)" },
          "66%": { transform: "translate3d(-2%, 2%, 0) scale(1.02)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.45s ease-out forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "category-marquee": "category-marquee linear infinite",
        "light-pulse": "light-pulse 5s ease-in-out infinite",
        "shimmer-sweep": "shimmer-sweep 6s ease-in-out infinite",
        "rgb-glow": "rgb-glow 3.8s linear infinite",
        "glass-glint": "glass-glint 5s ease-in-out infinite",
        "animal-float-a": "animal-float-a 5.5s ease-in-out infinite",
        "animal-float-b": "animal-float-b 6.2s ease-in-out infinite",
        "animal-float-c": "animal-float-c 4.8s ease-in-out infinite",
        "animal-waddle": "animal-waddle 5s ease-in-out infinite",
        "category-mesh-drift": "category-mesh-drift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
