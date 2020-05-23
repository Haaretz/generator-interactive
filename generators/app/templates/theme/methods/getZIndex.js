const indices = {
  modal: 100000,
  masthead: 10000,
  stickyListViewHeader: 2,
  above: 1,
  base: 0,
  below: -1,
};

/**
 * Get predefined named zIndex levels, with ability to offset result
 * @param {string|string[]} level
 *   The named level, an array represents hirarchy inside the first item
 *   e.g., if the `indices` object has a `foo` key, which is itself an
 *   object with `base`, `bar` and `bar` keys, `getZIndex(['foo', 'bar'])`
 *   will return the value assigned to `indices.foo.bar`. `base` is the default
 *   key, so `getZIndex('foo')` will return the value assigned to
 *   `indices.header.base`.
 * @param {number} [offset=0]
 *   The amount by which the returned index should be offset from that assigned to
 *   the named level.
 * @return {string} The z-index assigned to the named level
 *
 * @example
 * getZIndex('modal');           // => returns the level assigned to the
 *                                     named 'modal' level
 * getZIndex('modal', -1);       // => returns the level assigned to the
 *                                     named 'modal' level, minus 1
 * getZIndex(['foo', 'bar',]); // => returns the level assigned to the
 *                                     'bar' level, inside the named
 *                                     'foo' level
 */
export default function getZIndex(level, offset = 0, altIndices) {
  if (![ 'number', 'undefined', ].includes(typeof offset)) {
    throw new Error(
      `the "offset" argument of "getZIndex" must be a number.\nYou passed ${offset}, which is a(n) ${typeof offset}`
    );
  }

  const levels = altIndices || indices;

  const levelIsArray = Array.isArray(level);
  const value = levelIsArray
    ? _getValue(levels, level)
    : typeof levels[level] === 'number'
      ? levels[level]
      : levels[level]
        ? levels[level].base
        : null;

  if (value === null) {
    throw new Error(
      `"${levelIsArray ? level.join('.') : level}" isn't a named z-index level`
    );
  }

  return `${value + offset}`;
}
// eslint-disable-next-line no-underscore-dangle
function _getValue(source, levels) {
  const [ topLevel, ...restLevels ] = levels;
  const value = source[topLevel];

  // eslint-disable-next-line eqeqeq
  if (value == null) return null;

  return typeof value === 'number' ? value : _getValue(value, restLevels);
}
