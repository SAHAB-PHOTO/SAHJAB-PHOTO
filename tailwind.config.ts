import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        gold: {
          50: "#FBF7EB",
          100: "#F4EAC8",
          200: "#E9D391",
          300: "#DCBA5C",
          400: "#D2AC4D",
          500: "#C9A961",
          600: "#A8893E",
          700: "#7E682E",
          800: "#54461F",
          900: "#2B1810",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          50: "#FFFFFF",
          100: "#FAF7F2",
          200: "#F1EAE0",
          300: "#E5D9C7",
        },
        cocoa: {
          DEFAULT: "#2B1810",
          50: "#FAF7F5",
          100: "#E8DDD6",
          200: "#C8A99A",
          300: "#8A6555",
          400: "#5C4234",
          500: "#3D2820",
          900: "#2B1810",
        },
        rose: {
          gold: "#B76E79",
          dark: "#94545F",
          light: "#D89BA4",
        },
        emerald: {
          DEFAULT: "#0F5132",
          light: "#1A7A4D",
        },
      },
      fontFamily: {
        amiri: ['"Amiri"', "serif"],
        kufi: ['"Reem Kufi"', "sans-serif"],
        tajawal: ['"Tajawal"', "sans-serif"],
        cairo: ['"Cairo"', "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
        inter: ['"Inter"', "sans-serif"],
        display: ['"Reem Kufi"', '"Playfair Display"', "serif"],
        body: ['"Tajawal"', '"Inter"', "sans-serif"],
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "6px",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(43, 24, 16, 0.08)",
        elevated: "0 10px 40px -12px rgba(43, 24, 16, 0.12)",
        gold: "0 0 0 1px rgba(201, 169, 97, 0.4), 0 8px 24px -8px rgba(201, 169, 97, 0.3)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D2AC4D 0%, #C9A961 50%, #A8893E 100%)",
        "gold-divider":
          "linear-gradient(90deg, transparent 0%, #C9A961 50%, transparent 100%)",
        "cream-gradient":
          "linear-gradient(180deg, #FAF7F2 0%, #F1EAE0 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
