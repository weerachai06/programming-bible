import plugin from "tailwindcss/plugin";

const STICKY_VARIABLES_CONFIG = {
  prefix: "sticky",
  offsetSuffix: "offset",
  heightSuffix: "height",
  classNamePrefix: "sticky-stack",
} as const;

const internalVariables = {
  stickyOffset: "sticky-offset",
  stickyHeight: "sticky-height",
  stickyStack: "sticky-stack",
  stickyCurrentId: "sticky-current",
} as const;

interface CreateStickyParams {
  height?: string;
}

export const createStickyStyles = (params: CreateStickyParams) => {
  const { height: _height = 0 } = params || {};
  const heightVariable = `--${STICKY_VARIABLES_CONFIG.prefix}-${STICKY_VARIABLES_CONFIG.heightSuffix}`;

  const height = typeof _height === "string" ? _height : `${_height}px`;

  return {
    [heightVariable]: height,
  };
};

const createStickyConfigurations = () => {
  return {
    plugin: plugin(({ matchUtilities, addUtilities, theme }) => {
      addUtilities({
        [`.${STICKY_VARIABLES_CONFIG.classNamePrefix}`]: {
          position: "sticky",
          top: "var(--sticky-offset)",
          zIndex: "100",
        },
      });

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

      matchUtilities(
        {
          [internalVariables.stickyHeight]: (value) => ({
            [`--${internalVariables.stickyHeight}`]: `calc(${value})`,
            "& + *": {
              "--sticky-offset": `calc(var(--sticky-offset, 0px) + ${value})`,
            },
          }),
        },
        { values: theme("stickyHeight") }
      );
    }),
  };
};

export default createStickyConfigurations;
