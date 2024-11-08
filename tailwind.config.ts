import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/shared/constants/flash-update.ts",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    stickyStack: {
      0: "0",
      1: "1rem",
      2: "2rem",
      3: "3rem",
      4: "4rem",
    },
    stickyOffset: {
      0: "0",
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
  plugins: [
    plugin(function ({ matchUtilities, theme, addBase, addUtilities }) {
      addBase({
        ":root": {
          "--header": "56px",
          "--sticky-base": "0",
          "--sticky-height": "4rem",
          counterReset: "sticky-stack",
        },
      });
      // Container and element utilities
      addUtilities({
        ".sticky-container": {
          contentVisibility: "auto",
          containIntrinsicSize: "auto",
        },
        ".sticky-element": {
          position: "sticky",
          counterIncrement: "sticky-stack",
          top: "calc(var(--sticky-base) + (counter(sticky-stack) - 1) * var(--sticky-height))",
        },
      });
      // Match utilities for custom sticky offsets
      matchUtilities(
        {
          "sticky-height": (value) => ({
            "--sticky-height": value,
          }),
          "sticky-offset": (value) => ({
            position: "sticky",
            top: value,
          }),
        },
        { values: theme("stickyStack") }
      );
    }),
  ],
};
export default config;
