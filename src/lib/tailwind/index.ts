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
  height?: string;
}

export const createStickyStyles = (params: CreateStickyParams) => {
  const { id, height: _height = 0 } = params || {};
  const heightVariable = `--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.heightSuffix}`;

  const height = typeof _height === "string" ? _height : `${_height}px`;

  return {
    [heightVariable]: height,
  };
};

const createStickyConfigurations = <TStickyId extends string>(
  ids: TStickyId[]
) => {
  return {
    plugin: plugin(({ addBase, matchUtilities, addUtilities, theme }) => {
      const initRootVariables = ids.reduce((acc, id) => {
        return {
          ...acc,
          [`--${STICKY_VARIABLES_CONFIG.prefix}-${id}`]: "0",
          [`--${STICKY_VARIABLES_CONFIG.prefix}-${id}-${STICKY_VARIABLES_CONFIG.heightSuffix}`]:
            "0px",
        };
      }, {});

      const hasBaseSelector = ids.reduce((acc, id) => {
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
        ids.reduce((acc, id, index) => {
          const className = `.${STICKY_VARIABLES_CONFIG.classNamePrefix}-${id}`;
          const topValue = ids
            .slice(0, index)
            .map(
              (prevId) =>
                `var(--${STICKY_VARIABLES_CONFIG.prefix}-${prevId}, 0) * var(--${STICKY_VARIABLES_CONFIG.prefix}-${prevId}-${STICKY_VARIABLES_CONFIG.heightSuffix}, 0px)`
            )
            .concat(`var(--sticky-offset, 0px)`)
            .join(" + ");

          return {
            ...acc,
            [className]: {
              position: "sticky",
              top: `calc(${topValue})`,
            },
          };
        }, {})
      );

      matchUtilities(
        {
          "sticky-offset": (value) => {
            return {
              "--sticky-offset": value,
            };
          },
        },
        { values: theme("stickyOffset") }
      );
    }),
  };
};

export default createStickyConfigurations;
