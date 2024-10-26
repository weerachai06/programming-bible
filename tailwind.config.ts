import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/shared/constants/flash-update.ts",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
