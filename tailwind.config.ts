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
          "--header": "0",
          "--navigation": "0",
          "--sidebar": "0",
          "--header-height": "4rem",
          "--navigation-height": "56px",
        },
        "body:has(.stack-header)": {
          "--header": "1",
        },
        "body:has(.stack-navigation)": {
          "--navigation": "1",
        },
        "body:has(.stack-sidebar)": {
          "--sidebar": "1",
        },
      });
      // Stack utilities
      addUtilities({
        ".stack-header": {
          position: "sticky",
          top: "0",
        },
        ".stack-navigation": {
          position: "sticky",
          top: "calc(var(--header) * var(--header-height))",
        },
        ".stack-sidebar": {
          position: "sticky",
          top: "calc(var(--header, 0) * var(--header-height, 0px) + var(--navigation, 0) * var(--navigation-height, 0px) + var(--sticky-offset, 0px))",
        },
      });

      // Height utilities
      matchUtilities(
        {
          "sticky-offset": (modifier) => {
            return {
              "--sticky-offset": modifier,
            };
          },
        },
        { values: theme("stickyOffset") }
      );
    }),
  ],
};
export default config;
