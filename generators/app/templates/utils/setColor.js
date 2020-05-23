/**
 * A helper function for setting color-related style properties
 * (color, backgroundColor, fill, etc.) in a generic manner
 *
 * @prop {string} prop
 *   The color-related property to be set
 * @prop {string|[string, string?, ColorPallete?]} value
 *   The argument that will be passed to the colorGetter function.
 *   Can either be `string` representing a named color, or a `tuple`
 *   holding a `string` representing a named color, an optional string
 *   representing a variant of the named color and an optional
 *   `ColorPalette` to get the color values from instead of the default one.
 * @prop {function} getColor
 *   A `ColorPalette` function
 *
 * @return {Object}
 *   A single-prop style object with a color value assigned to the key.
 */
export default function setColor(
  prop,
  value,
  getColor
) {
  const colorArgs = Array.isArray(value) ? value : [ value, ];
  return {
    [prop]: getColor(...colorArgs),
  };
}
