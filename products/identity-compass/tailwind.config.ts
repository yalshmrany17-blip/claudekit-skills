import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        panel: "var(--panel)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-deep": "var(--accent-deep)",
        "accent-soft": "var(--accent-soft)",
        good: "var(--good)",
        warn: "var(--warn)",
        bad: "var(--bad)",
        "good-soft": "var(--good-soft)",
        "warn-soft": "var(--warn-soft)",
        "bad-soft": "var(--bad-soft)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Segoe UI", "Tahoma", "sans-serif"],
        display: ["var(--font-display)", "Amiri", "serif"],
      },
      maxWidth: { prose: "68ch" },
      boxShadow: { soft: "0 1px 2px rgba(23,32,51,.06), 0 8px 24px rgba(23,32,51,.06)" },
    },
  },
  plugins: [],
};

export default config;
