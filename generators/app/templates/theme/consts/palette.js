////////////////////////////////////////////////////////////////////////
//                          TYPE DEFINITIONS                          //
////////////////////////////////////////////////////////////////////////

/**
 * A tuple of one or two items, pointing to a color (and optionally a variant)
 * in the {@link baseColors} dictionary.
 * An alias to a color with variants _must_ always be a two-item tuple.
 * -----------------------
 * @typedef {Array<string>} ColorAlias
 * -----------------------
 * @prop {string} 0
 *   The first item of a ColorAlias tuple is used to identify a color name.
 * @prop {string} [1]
 *   The (optional) second item of a `ColorAlias` tuple is used to identify a
 *   variant inside the color pointer to in the first item.
 * -----------------------
 *  @example <caption>Alias to color without variants</caption>
 *  [ 'transparent', ]
 *  // -> points to { transparent: { themeName: 'rgba(0,0,0,0)', }, }
 *  @example <caption>Alias to color with variants</caption>
 *  [ 'neutral', '-1', ]
 *  // -> points to { neutral: { '-1': { themeName: 'rgba(0,0,0,0)', }, }, }
 */

/**
 * An object of a color's values in each theme, keyed by theme names set in the
 * {@link themeNames} array:
 *   * The object must have a property for each theme in `themeNames`.
 *   * values should be a css color (string), e.g., `{ darkMode: #fff }`
 * -----------------------
 * @typedef {Object.<string, string>} BaseColorThemes
 */

/**
 * The variants of a named color.
 * -----------------------
 * @typedef {Object.<string, BaseColorThemes>} BaseColorVariants
 * -----------------------
 * @example
 * {
 *   '-8': {
 *     default: '#fff',
 *     darkMode: '#000',
 *   },
 *   // ...
 * },
 */

/**
 * An object of a color's values in each theme, keyed by theme names set in the
 * `themeNames` array.
 *   * The object must have a property for each theme in `themeNames`.
 *   * values should be a {@link ColorAlias} array of one or two strings,
 *     pointing to another color, e.g., `{ darkMode: [ 'transparent', ], }` or
 *     `{ darkMode: [ 'neutral', '-1', ], }`
 * -----------------------
 * @typedef {Object.<string, ColorAlias>} ColorAliasThemes
 */

/**
 * The variants of a color alias.
 * -----------------------
 * @typedef {Object.<string, ColorAliasThemes>} ColorAliasVariants
 * -----------------------
 * @example
 * {
 *   '-8': {
 *     default: '#fff',
 *     darkMode: '#000',
 *   },
 *   // ...
 * },
 */

////////////////////////////////////////////////////////////////////////
//                               CONFIG                               //
////////////////////////////////////////////////////////////////////////

/**
 * A list of themes color themes for the application.
 *
 * The first specified theme is the default and will not be qualified by a class.
 * Custom properties for subsequent themes will be qualified by a class of the
 * same name.
 * -----------------------
 * @type {Array<string>}
 * -----------------------
 * @example
 * const themeNames = [ 'default', 'darkMode', ];`
 * const baseColors = {
 *   neutral: {
 *     default: #222,
 *     darkMode: #ebebeb,
 *   },
 * };
 * // Will create the following rulesets:
 * // :root {
 * //   --neutral: #222;
 * //  // ...
 * // }
 * // .darkMode {
 * //   --neutral: #ebebeb;
 * // }
 */
export const themeNames = [ 'default', /* 'darkMode', */ ];

/**
 * A dictionary of named colors and their values. All color _values_ used in the
 * application, on all their theme variations, should be defined here. Semantic
 * aliases pointing to these named colors can be defined in the
 * {@link colorAliases} dictionary.
 *
 * Each color or variant must have a value defined for each theme defined in
 * the {@link thmeNames} array.
 * -----------------------
 * @type {Object.<string, (BaseColorThemes|BaseColorVariants)}
 * -----------------------
 * @example
 * const baseColors = {
 *   // A named color without variants
 *   transparent: {
 *     default: 'rgba(0,0,0,0)',
 *     darkMode: 'rgba(0,0,0,0)',
 *   },
 *   // A named color with variants
 *   neutral: {
 *     '-1': {
 *       default: '#ebebeb',
 *       darkMode: '#222',
 *     },
 *     '0': {
 *       default: '#2d2d2d',
 *       darkMode: '#ccc',
 *     },
 *     '1': {
 *       default: '#222',
 *       darkMode: '#ebebeb',
 *     },
 *   },
 * };
 */
const baseColors = {
  transparent: {
    default: 'rgba(0,0,0,0)',
    darkMode: 'rgba(0,0,0,0)',
  },
  neutral: {
    '-10': {
      default: '#FFF',
      darkMode: '#000',
    },
    '-7': {
      default: '#F5F5F5',
      darkMode: '#161616',
    },
    '-6': {
      default: '#EBEBEB',
      darkMode: '#222',
    },
    '-5': {
      default: '#CCC',
      darkMode: '#2D2D2D',
    },
    '-4': {
      default: '#B4B4B4',
      darkMode: '#505050',
    },
    '-3': {
      default: '#787878',
      darkMode: '#787878',
    },
    '-2': {
      default: '#505050',
      darkMode: '#B4B4B4',
    },
    '-1': {
      default: '#2D2D2D',
      darkMode: '#CCC',
    },
    base: {
      default: '#222',
      darkMode: '#EBEBEB',
    },
    '1': {
      default: '#161616',
      darkMode: '#F5F5F5',
    },
    '2': {
      default: '#000',
      darkMode: '#FFF',
    },
  },
  brand: {
    '-6': {
      default: '<%= site === "themarker.com" ? "#F0FAF0" : "#EBF2F5" %>',
    },
    '-5': {
      default: '<%= site === "themarker.com" ? "#F0FDE6" : "#E6EDF0" %>',
    },
    '-4': {
      default: '<%= site === "themarker.com" ? "#D0F5D0" : "#DAE9F2" %>',
    },
    '-3': {
      default: '<%= site === "themarker.com" ? "#A2EBA2" : "#ACD2ED" %>',
    },
    '-2': {
      default: '<%= site === "themarker.com" ? "#5CDC5C" : "#169FD1" %>',
    },
    '-1': {
      default: '<%= site === "themarker.com" ? "#45D745" : "#289DD3" %>',
    },
    base: {
      default: '<%= site === "themarker.com" ? "#00C800" : "#0B7EB5" %>',
    },
    '1': {
      default: '<%= site === "themarker.com" ? "#00A400" : "#006B96" %>',
    },
  },
  // primary: {
  //   '-1': {
  //     default: 'YOURCOLOR',
  //   },
  //   base: {
  //     default: 'YOURCOLOR',
  //   },
  //   '1': {
  //     default: 'YOURCOLOR',
  //   },
  // },
  // secondary: {
  //   '-1': {
  //     default: 'YOURCOLOR',
  //   },
  //   base: {
  //     default: 'YOURCOLOR',
  //   },
  //   '1': {
  //     default: 'YOURCOLOR',
  //   },
  // },
  tertiary: {
    '-4': {
      default: '#FEE',
    },
    '-3': {
      default: '#FFA6A6',
    },
    '-2': {
      default: '#CC7676',
    },
    '-1': {
      default: '#AB353B',
    },
    base: {
      default: '#A8001C',
    },
    1: {
      default: '#8A021B',
    },
    2: {
      default: '#6A0114',
    },
    3: {
      default: '#480713',
    },
  },
  // quaternary: {},

  // social
  facebook: {
    default: '#3b5998',
    darkMode: '#4766A6',
  },
  twitter: {
    default: '#1DA1F2',
    darkMode: '#1DA1F2',
  },
  whatsapp: {
    default: '#25D366',
    darkMode: '#dcf8c6',
  },

  sales: {
    '-2': {
      default: '#FFF7E5',
    },
    '-1': {
      default: '#FFBD45',
    },
    base: {
      default: '#FFA500',
    },
    '+1': {
      default: '#FA9600',
    },
    '+2': {
      default: '#ED8600',
    },
  },

  // TODO: move to colorAliases
  // Used for text selection highlight
  // This is a required color, but might be better defined
  // in `colorAliases` when there is a suitable color in the
  // `baseColors` palette
  highlight: {
    default: '#FFE70C',
    darkMode: 'rgba(153,138,0,.6)',
  },
};

/**
 * A dictionary of semantic color aliases, which point to named colors in the
 * {@link baseColors} dictionary. Should be used for elements that need to use
 * different named colors in different themes.
 * -----------------------
 * @type {(undefined|Object.<string, (ColorAliasThemes|ColorAliasVariant))}
 * -----------------------
 * @example
 * const colorAliases = {
 *   // A color alias without variants
 *   hightlight: {
 *     default: [ 'tertiary' ],
 *     darkMode: [ 'secondary', '1', ],
 *   },
 *   // A color alias with variants
 *   primaryButton: {
 *     backgroundColor: {
 *       default: [ 'primary', '1', ],
 *       darkMode: [ 'primary', '-1', ],
 *     },
 *     border: {
 *       default: [ 'primary', '2', ],
 *       darkMode: [ 'primary', '-4', ],
 *     },
 *   },
 * };
 */
const colorAliases = {
  link: {
    base: {
      default: [ 'primary', ],
    },
  },
  bodyText: {
    default: [ 'neutral', '-1', ],
    darkMode: [ 'neutral', ],
  },
  bodyTextHighlight: {
    default: [ 'highlight', ],
    darkMode: [ 'highlight', ],
  },
  pageBg: {
    default: [ 'neutral', '-10', ],
  },

  commentPrimary: {
    '-3': {
      default: [ 'brand', '-6', ],
    },
    '-2': {
      default: [ 'brand', '-4', ],
    },
    '-1': {
      default: [ 'brand', '-3', ],
    },
    base: {
      default: [ 'brand', 'base', ],
    },
    1: {
      default: [ 'brand', '1', ],
    },
  },
  commentSecondary: {
    '-4': {
      default: [ 'neutral', '-10', ],
    },
    '-3': {
      default: [ 'neutral', '-4', ],
    },
    '-2': {
      default: [ 'neutral', '-3', ],
    },
    '-1': {
      default: [ 'neutral', '-2', ],
    },
    base: {
      default: [ 'neutral', '-1', ],
    },
  },
  commentNegative: {
    '-1': {
      default: [ 'tertiary', '-4', ],
    },
    base: {
      default: [ 'tertiary', 'base', ],
    },
    1: {
      default: [ 'tertiary', '1', ],
    },
  },

  listHeader: {
    default: [ 'brand', 'base', ],
  },
  listBg: {
    default: [ 'neutral', '-10', ],
  },
  listContent: {
    '-1': {
      default: [ 'neutral', '-3', ],
    },
    base: {
      default: [ 'neutral', '-1', ],
    },
  },
};

const palette = createColorPalette(baseColors, colorAliases);

export default palette;

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function createColorPalette(basePalette, aliasesPalette) {
  const isValidBasePalette = validatePalette(basePalette);
  const isValidColorAliases = aliasesPalette
    ? validatePalette(aliasesPalette, true, basePalette)
    : true;

  if (!isValidBasePalette) {
    throw new Error(
      'Your base color palette is invalid\n'
        + '(Most likely, not all colors have definitions for all themes)'
    );
  }
  if (!isValidColorAliases) {
    throw new Error(
      'Your color aliases are invalid\n'
        + '(Most likely, not all themes are defined for each color, '
        + 'or aliases point to non-existing colors in the base color palette)'
    );
  }
  return {
    ...basePalette,
    ...(aliasesPalette || {}),
  };
}

function validatePalette(
  colorPalette,
  validateAliases = false,
  basePalette = null
) {
  return Object.values(colorPalette).reduce((isValid, variantsOrThemes) => {
    if (!isValid) return false;

    const [ isThemes, hasValuesForEachTheme, isValidAlias, ] = isValidThemes(
      variantsOrThemes,
      validateAliases,
      basePalette
    );

    if (isThemes) {
      if (!hasValuesForEachTheme && (isValidAlias || !validateAliases)) {
        return false;
      }
      return true;
    }

    const variants = variantsOrThemes;
    return validatePalette(variants, validateAliases, basePalette);
  }, true);
}

function isValidThemes(
  themeOptions = {},
  validateAlias = false,
  basePalette = null
) {
  const definedThemes = Object.keys(themeOptions);
  const [ isThemes, hasValuesForEachTheme, ] = validateThemes(definedThemes);
  const isValidAlias
    = isThemes && hasValuesForEachTheme && validateAlias
      ? definedThemes.reduce((isValidated, themeName) => {
        if (!isValidated) return false;

        const alias = themeOptions[themeName];
        if (!Array.isArray(alias)) return false;

        const [ color, variant, ] = alias;

        const isValid = isValidThemes(
          variant ? basePalette[color]?.[variant] : basePalette[color]
        )[2];

        return isValid;
      }, true)
      : false;

  return [ isThemes, hasValuesForEachTheme, isValidAlias, ];
}

export function validateThemes(themes) {
  const defaultTheme = themeNames[0];
  const isThemes = themes.includes(defaultTheme);
  /* eslint-disable operator-linebreak */
  const hasValuesForEachTheme = isThemes
    ? // Ensure values are defined for each theme
      themes.length &&
      // make sure defined themes match the list of themes
      themeNames.filter(themeName => !themes.includes(themeName)).length === 0
      : false;
  /* eslint-enable operator-linebreak */

  return [ isThemes, hasValuesForEachTheme, ];
}
