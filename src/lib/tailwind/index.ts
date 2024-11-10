import plugin from "tailwindcss/plugin";

const STICKY_VARIABLES_CONFIG = {
  prefix: "sticky",
  offsetSuffix: "offset",
  heightSuffix: "height",
  classNamePrefix: "sticky-stack",
};

const stickyIds = ["header", "navigation", "sidebar", "footer"] as const;

interface CreateStickyParams {
  id: (typeof stickyIds)[number];
  height: string;
  offset: string;
}

export const createStickyStyles = ({
  id,
  height,
  offset,
}: CreateStickyParams) => {
  const heightVariable = `--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.heightSuffix}`;
  const offsetVariable = `--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.offsetSuffix}`;

  return {
    [heightVariable]: height,
    [offsetVariable]: offset,
  };
};

export default plugin(({ addBase, matchUtilities, addUtilities }) => {
  const initRootVariables = stickyIds.reduce((acc, id) => {
    return {
      ...acc,
      [`--${STICKY_VARIABLES_CONFIG.prefix}-${id}`]: "0",
      [`--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.heightSuffix}`]:
        "0",
    };
  }, {});

  const hasBaseSelector = stickyIds.reduce((acc, id) => {
    const baseSelector = `body:has(.${STICKY_VARIABLES_CONFIG.classNamePrefix}-${id})`;

    return {
      ...acc,
      [baseSelector]: {
        [`--${STICKY_VARIABLES_CONFIG.prefix}-${id}`]: "1",
      },
    };
  }, {});

  addBase({
    ":root": {
      ...initRootVariables,
    },
    ...hasBaseSelector,
  });

  addUtilities(
    stickyIds.reduce((acc, id) => {
      const className = `.${STICKY_VARIABLES_CONFIG.classNamePrefix}-${id}`;
      const heightVariable = `var(--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.heightSuffix})`;
      const offsetVariable = `var(--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.offsetSuffix})`;

      return {
        ...acc,
        [className]: {
          position: "sticky",
          top: ``,
          height: heightVariable,
        },
      };
    }, {})
  );

  matchUtilities({
    stickyOffset: (modifier) => {
      const value = theme(
        `theme.${STICKY_VARIABLES_CONFIG.prefix}.${modifier}`
      );

      if (!value) {
        return {};
      }

      return {};
    },
  });
});
