import { getProps, } from './animationHelpers';

export default function getDelay(type, delay) {
  return getProps(type, undefined, undefined, delay);
}
