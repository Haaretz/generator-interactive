import { getProps, } from './animationHelpers';
/**
 * Set a timing-function for an animation or transition based on preconfigured options
 * @param {'animation', 'transition'} type - The effect to which timing function is applied to.
 * @param {'linear'|'swiftIn'|'swiftOut'|'easeIn'|'easeOut'|'easeInOut'} [easing]
 *   A named timing-function describing how the intermediate values of the CSS properties
 *   being affected by an animation or transition effect are calculated.
 * @return {Object} - An object with an `${type}TimingFunction` property.
 */
export default function getTimingFunction(type, easing) {
  return getProps(type, undefined, easing, undefined);
}
