export const timingFunctions = {
  linear: 'linear',
  swiftIn: 'cubic-bezier(0, 0, .2, 0)',
  swiftOut: 'cubic-bezier(.55, 0, .1, 1)',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
};

export function getProps(type, duration, easing, delay) {
  if (
    typeof duration === 'undefined'
    && typeof delay === 'undefined'
    && !easing
  ) {
    throw new Error('You must pass at least one of the arguments');
  }
  const timingFunction = Array.isArray(easing)
    ? easing.map(value => timingFunctions[value]).toString()
    : timingFunctions[easing];

  if ([ 'animation', 'transition', ].indexOf(type) < 0) {
    throw new Error('"type" must be either "animation" or "transition"');
  }
  if (easing && !timingFunction) {
    throw new Error(`"${easing}" is not a named timing function`);
  }
  return {
    ...(typeof duration !== 'undefined'
      ? { [`${type}Duration`]: getTime(duration), }
      : undefined),
    ...(timingFunction
      ? { [`${type}TimingFunction`]: timingFunction, }
      : undefined),
    ...(typeof delay !== 'undefined'
      ? { [`${type}Delay`]: getTime(delay), }
      : undefined),
  };
}

// 1. 60fps. Most often way too quick for an animation to be perceived
function getTime(step) {
  if (Array.isArray(step)) {
    return step.map(value => getTime(value)).toString();
  }

  if (step < -1) {
    throw new RangeError(
      `"step" may not be lower than "-1". You passed "${step}"`
    );
  }

  return step === -1
    ? `${10 / 60}s` // [1]
    : step === 0
      ? '.25s'
      : step === 1
        ? '.3s'
        : `${0.25 * step}s`;
}
