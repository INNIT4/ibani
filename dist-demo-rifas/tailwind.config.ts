import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-red": "#E11D48", // Rose-600
        "brand-gray": "#F8FAFC", // Slate-50
        "brand-text": "#0F172A", // Slate-900
        "brand-muted": "#64748B", // Slate-500
      },
      fontFamily: {
        modern: ["var(--font-modern)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
