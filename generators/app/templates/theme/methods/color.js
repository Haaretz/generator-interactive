import palette, { validateThemes, themeNames, } from '../consts/palette';

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

export function colorFunctionsFactory(colorPalette, listOfThemes) {
  function generateColorCustomProps() {
    const colorCustomPropsByTheme = listOfThemes.reduce((result, themeName) => {
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

      const isThemes = validateThemes(
        Object.keys(colorPalette[color]),
        listOfThemes
      )[1];
      const themesFromPalette = isThemes
        ? colorPalette[color]
        : colorPalette[color][variant];

      Object.entries(themesFromPalette).forEach(([ theme, colorOrAlias, ]) => {
        if (listOfThemes.includes(theme)) {
          const isAlias = Array.isArray(colorOrAlias);

          if (isAlias) {
            // Make sure the color the alias is pointing to is activated
            const [ aliasColor, aliasVariant, ] = colorOrAlias;
            const aliasCustomProp = getCustomPropName(aliasColor, aliasVariant);
            if (!activatedColors.includes(aliasCustomProp)) {
              const aliasThemesFromPalette = aliasVariant
                ? colorPalette[aliasColor][aliasVariant]
                : colorPalette[color];

              Object.entries(aliasThemesFromPalette).forEach(
                ([ aliasedTheme, aliasedColor, ]) => {
                  if (listOfThemes.includes(aliasedTheme)) {
                    const cssString = `${CUSTOM_PROP_PREFIX}${aliasCustomProp}:${aliasedColor};`;
                    colorCustomPropsByTheme[aliasedTheme].push(cssString);
                  }
                }
              );
            }
          }
          const cssString = `${CUSTOM_PROP_PREFIX}${customPropName}:${
            isAlias
              ? `var(${CUSTOM_PROP_PREFIX}${getCustomPropName(
                ...colorOrAlias
              )})`
              : colorOrAlias
          };`;
          colorCustomPropsByTheme[theme].push(cssString);
        }
      });
    });

    return Object.entries(colorCustomPropsByTheme).reduce(
      (cssString, [ themeName, customProps, ]) => {
        const defaultThemeName = listOfThemes[0];
        const selector
          = defaultThemeName === themeName ? ':root' : `.${themeName}`;

        // sort color custom props so that aliases
        // are set *after* the colors they point to
        customProps.sort(a => (a.includes('var(--color-') ? 1 : -1));

        return `${cssString}${selector}{${customProps.join('')}}`;
      },
      ''
    );
  }

  function getColor(color, variant) {
    const variantSansPlus = stripLeadingPlus(variant);
    isColorDefined(colorPalette, color, variantSansPlus);

    const customPropName = getCustomPropName(color, variantSansPlus);

    if (!activatedColors.includes(customPropName)) activatedColors.push(customPropName);
    return `var(${CUSTOM_PROP_PREFIX}${customPropName})`;
  }

  return { generateColorCustomProps, getColor, };
}

const { generateColorCustomProps, getColor, } = colorFunctionsFactory(
  palette,
  themeNames
);

export { generateColorCustomProps, };
export default getColor;

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function stripLeadingPlus(string) {
  if (!string) return string;
  return string.startsWith('+') ? string.slice(1) : string;
}

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
