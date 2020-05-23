import { getProps, } from './animationHelpers';
/**
 * On object of transition-related css-properties.
 *
 * @typedef {Object} TransitionProperties
 *
 * @prop {string} [transitionDuration] - The duration of a transition
 * @prop {string} [transitionTimingFunction] - A transition's timing-function
 * @prop {string} [transitionDelay] - The delay before a transition is initiated
 */

/**
 * Set transition properties by preconfigured steps and named options
 *
 * @param {number} [duration] - The transition duration step.
 *   duration steps start at `0`, with `0.25s`, which is generally considered
 *   the minimal time a person needs for completing the eye-movement towards the element
 *   and preserving the animation itself. The next step up, `1` is a very subtle increment
 *   of `50ms` to `0.3s`, for when the user's eye is expected to travel larger distances,
 *   when the animation is somewhat more complex. These two steps will usually be the
 *   adequate choice for micro-interactions. Each step above is a multiple of `0.25s`,
 *   e.g., `0.5s`, `0.75s`, etc. These maybe useful for more complex animations.
 *
 *   A `-1` step is available for nearly instantaneous transitions that are 1 frame in
 *   a 60fps budget (~`0.166666s`).
 *
 * @param {'linear'|'swiftIn'|'swiftOut'|'easeIn'|'easeOut'|'easeInOut'} [easing]
 *   A named timing-function describing how the intermediate values of the CSS properties
 *   being affected by a transition effect are calculated.
 *
 * @param {number} [delay] - The transition delay step.
 *   Uses the same steps as `duration` to determine the amount of delay before a
 *   transition is initiated.
 *
 * @return {TransitionProperties} - An object of transition-related properties generated
 *   based on the arguments passed to the function.
 */
export default function getTransition(duration, easing, delay) {
  return getProps('transition', duration, easing, delay);
}
