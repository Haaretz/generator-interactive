// consts
import bps from './consts/bps';
import fontStacks from './consts/fontStacks';
import typeConf from './consts/typeConf';

// methods
import getColor from './methods/color';
import getDelay from './methods/getDelay';
import getDuration from './methods/getDuration';
import getTimingFunction from './methods/getTimingFunction';
import getTransition from './methods/getTransition';
import getTransitionString from './methods/getTransitionString';
import getMqString from './methods/getMqString';
import getZIndex from './methods/getZIndex';
import typesetter from './methods/typesetter';
import mq from './methods/mq';

const theme = Object.freeze({
  // Constants
  bps,
  fontStacks,
  typeConf,

  // Methods
  color: getColor,
  getDelay,
  getDuration,
  getTimingFunction,
  getTransition,
  getTransitionString,
  getMqString,
  getZIndex,
  mq,
  type: typesetter,
});

export default theme;
