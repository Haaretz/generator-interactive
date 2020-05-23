import palette, { themeNames, validateThemes, } from '../consts/palette';

////////////////////////////////////////////////////////////////////////
//                               CONFIG                               //
////////////////////////////////////////////////////////////////////////

/**
 * The string to prfix color custom props with.
 * Must start with `--`
 * -----------------------
 * @type {string}
 */
const CUSTOM_PROP_PREFIX = '--color-';

/**
 * The name of the default variant, which can be omitted when accessing a variant,
 * e.g., if `primary` has variants, `getColor('primary')` is the same as
 * `getColor('primary', 'base')`.
 * -----------------------
 * @type {string}
 */
const DEFAULT_VARIANT = 'base';

/**
 * The seperator between color and variant in color custom props.
 * -----------------------
 * @type {string}
 */
const CUSTOM_PROP_NAME_SEPERATOR = '-';

/**
 * The colors activated by `getColor`
 * -----------------------
 * @type {Array<string>}
 */
const activatedColors = [];

////////////////////////////////////////////////////////////////////////
//                             FUNCTIONS                              //
////////////////////////////////////////////////////////////////////////

export function colorFunctionsFactory(colorPalette) {
  function generateColorCustomProps() {
    const colorCustomPropsByTheme = themeNames.reduce((result, themeName) => {
      // eslint-disable-next-line no-param-reassign
      result[themeName] = [];
      return result;
    }, {});

    activatedColors.sort().forEach(customPropName => {
      const propRegex = new RegExp(
        `(.+?)(?:${CUSTOM_PROP_NAME_SEPERATOR}(.*))?$`
      );
      const [ , color, variant = DEFAULT_VARIANT, ] = customPropName.match(
        propRegex
      );

      const isThemes = validateThemes(Object.keys(colorPalette[color]))[1];
      const themesFromPalette = isThemes
        ? colorPalette[color]
        : colorPalette[color][variant];

      Object.entries(themesFromPalette).forEach(([ theme, colorOrAlias, ]) => {
        const isAlias = Array.isArray(colorOrAlias);
        const cssString = `${CUSTOM_PROP_PREFIX}${customPropName}:${
          isAlias
            ? `var(${CUSTOM_PROP_PREFIX}${getCustomPropName(...colorOrAlias)})`
            : colorOrAlias
        };`;
        colorCustomPropsByTheme[theme].push(cssString);
      });
    });

    return Object.entries(colorCustomPropsByTheme).reduce(
      (cssString, [ themeName, customProps, ]) => {
        const selector
          = themeNames[0] === themeName ? ':root' : `.${themeName}`;

        return `${cssString}${selector}{${customProps.join('')}}`;
      },
      ''
    );
  }

  function getColor(color, variant) {
    isColorDefined(colorPalette, color, variant);

    const customPropName = getCustomPropName(color, variant);

    if (!activatedColors.includes(customPropName)) activatedColors.push(customPropName);
    return `var(${CUSTOM_PROP_PREFIX}${customPropName})`;
  }

  return { generateColorCustomProps, getColor, };
}

const { generateColorCustomProps, getColor, } = colorFunctionsFactory(palette);

export { generateColorCustomProps, };
export default getColor;

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function isColorDefined(colorPalette, color, variant) {
  try {
    const baseColor = colorPalette[color];
    if (!baseColor) throw new Error();
    if (variant) {
      const colorVariant = baseColor[variant];
      if (!colorVariant) throw new Error();
    }
  }
  catch (err) {
    throw new Error(
      `"${color}${
        variant ? `.${variant}` : ''
      }" doesn't exist in the color palette`
    );
  }
}

function getCustomPropName(color, variant) {
  return [ color, variant, ]
    .filter(x => x && x !== DEFAULT_VARIANT)
    .join(CUSTOM_PROP_NAME_SEPERATOR);
}

/** Helper to clear `activatedColors` in test tearups or teardowns */
export const clearActivatedColors = () => {
  activatedColors.length = 0;
};
