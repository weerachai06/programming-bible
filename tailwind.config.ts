import type { Config } from "tailwindcss";
import stickyPlugin from "./src/lib/tailwind";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/shared/constants/flash-update.ts",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    stickyOffset: {
      0: "0px",
      1: "1rem",
      2: "2rem",
      3: "3rem",
      4: "4rem",
      5: "5rem",
      6: "6rem",
      7: "7rem",
      8: "8rem",
      9: "9rem",
      10: "10rem",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [stickyPlugin().plugin],
};
export default config;
