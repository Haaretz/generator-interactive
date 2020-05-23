import { getProps, } from './animationHelpers';

export default function getDuration(type, duration) {
  return getProps(type, duration, undefined, undefined);
}
