import bps from './bps';
import typeConf from './typeConf';
import typesetter from '../methods/typesetter';
import mq from '../methods/mq';

/**
 * Convert camelCase to kebab-case. Useful in conversion of
 * css-in-js objects to strings that are proper css.
 *
 * @param {string} string - The string to convert
 *
 * @return {string} the converted string in kebab-case
 */
const camelToKebab = string => string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * The typeConf breakpoint-names, sorted in an array by ascending width
 */
const typeConfBpsOrder = Object.keys(typeConf).sort(
  (a, b) => (a === 'default' ? -1 : bps.widths[a] - bps.widths[b])
);

/**
 * Convert a css-in-js object into a proper css-like string
 *
 * @param {Object} rules - A css-in-js object
 *
 * @return {string} - a css-like string
 */
const objToCSSString = rules => Object.keys(rules).reduce(
  (cssString, prop) => `${cssString}${camelToKebab(prop)}:${rules[prop]};`,
  ''
);

/**
 * Base fontSize for `html` element
 * for setting `1rem` to the basic vertical rhythm unit
 *
 * @type {Object}
 */
const htmlFontSizes = typeConfBpsOrder.reduce((rules, bp, i) => {
  const mqOptions = {
    until:
      i + 1 !== typeConfBpsOrder.length ? typeConfBpsOrder[i + 1] : undefined,
    from: i !== 0 ? typeConfBpsOrder[i] : undefined,
  };

  return {
    ...rules,
    ...mq(mqOptions, { fontSize: `${typeConf[bp].rhythmUnit}px`, }),
  };
}, {});

/**
 * Base font-size of `html` element converted into a css-like string.
 *
 * @type {string}
 */
export const htmlFontSizesAsString = Object.keys(htmlFontSizes).reduce(
  (rules, mqName) => `${rules}${mqName}{html{${objToCSSString(htmlFontSizes[mqName])}}}`,
  ''
);

/**
 * Base typographic style for `body` element
 *
 * @type {Object}
 */
const bodyTypographyRules = { ...typesetter(0), };

/**
 * Base typographic style for `body` element
 * converted into a css-like string.
 *
 * @type {string}
 */
export const bodyTypographyRulesAsString = `body{${objToCSSString(bodyTypographyRules)}}`;

const typographicBaseline = htmlFontSizesAsString + bodyTypographyRulesAsString;
export default typographicBaseline;
