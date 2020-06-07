import { createTypesetter, } from '@haaretz/htz-css-tools';
import mq from './mq';
import bps from '../consts/bps';
import typeConf from '../consts/typeConf';

const typesetter = createTypesetter(mq, typeConf, bps.widths);

const activeatedTypeSteps = {};
const typeCustomPropsInMergedMqs = {};

export function generateTypographicCustomProps() {
  Object.entries(activeatedTypeSteps).forEach(([ step, withLineHeight, ]) => {
    const values = typesetter(step);
    mergeTypeMqs(step, values, withLineHeight);
  });
  return Object.entries(typeCustomPropsInMergedMqs).reduce(
    (allCustomProps, [ stepOrMq, valuesOrSteps, ]) => {
      const currentCustomProp = stringifyTypeValues(stepOrMq, valuesOrSteps);
      return allCustomProps + currentCustomProp;
    },
    ''
  );
}

export default function type(...args) {
  const firstArg = args[0];
  const firstArgIsOptions = firstArg.step != null;
  const step = firstArgIsOptions ? firstArg.step : firstArg;
  const options = (firstArgIsOptions ? firstArg : args[1]) || {};
  const from = options.from || options.fromBp;
  const until = options.until || options.untilBp;
  const lines = options.lines;

  // Only enable `withLineHeight`, never disable it if it was previously anabled
  if (!activeatedTypeSteps[step]) {
    activeatedTypeSteps[step] = lines == null;
  }

  if (from || until) {
    return mq(
      { from, until, },
      {
        fontSize: `var(--fz-${step})`,
        lineHeight: lines ? `${lines}rem` : `var(--lh-${step})`,
      }
    );
  }

  return {
    fontSize: `var(--fz-${step})`,
    lineHeight: lines ? `${lines}rem` : `var(--lh-${step})`,
  };
}

function mergeTypeMqs(step, values, withLineHeight) {
  Object.keys(values).forEach(prop => {
    const isMq = prop.startsWith('@');
    const keyToInsertIn = isMq ? prop : step;
    if (!typeCustomPropsInMergedMqs[keyToInsertIn]) typeCustomPropsInMergedMqs[keyToInsertIn] = {};

    const stepValues = {
      fontSize: isMq ? values[prop].fontSize : values.fontSize,
    };
    if (withLineHeight) {
      stepValues.lineHeight = isMq
        ? values[prop].lineHeight
        : values.lineHeight;
    }
    if (isMq) typeCustomPropsInMergedMqs[keyToInsertIn][step] = stepValues;
    else typeCustomPropsInMergedMqs[keyToInsertIn] = stepValues;
  });
}

function stringifyTypeValues(stepOrMq, valuesOrSteps) {
  const propToShorMap = { lineHeight: 'lh', fontSize: 'fz', };
  const isMq = stepOrMq.startsWith('@');

  if (isMq) {
    const mediaQuery = stepOrMq;
    const steps = valuesOrSteps;
    const declerations = Object.entries(steps).reduce(
      (result, [ step, values, ]) => result + stringifyTypeValues(step, values),
      ''
    );

    return `${mediaQuery}{:root{${declerations}}}`;
  }

  const step = stepOrMq;
  const values = valuesOrSteps;
  return Object.entries(values).reduce((result, [ prop, value, ]) => {
    const customProp = `--${propToShorMap[prop]}-${step}:${value};`;
    return `${result}${customProp}`;
  }, '');
}
