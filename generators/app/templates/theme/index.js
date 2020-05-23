// consts
import bps from './consts/bps';
import cssReset from './consts/cssReset';
import fontStacks from './consts/fontStacks';
import getColor, { generateColorCustomProps, } from './methods/color';
import mq from './methods/mq';
import palette from './consts/palette';
import theme from './theme';
import typesetter, {
  generateTypographicCustomProps,
} from './methods/typesetter';

export default theme;
export {
  theme,
  cssReset,
  palette,
  bps,
  fontStacks,
  generateColorCustomProps,
  generateTypographicCustomProps,
  getColor,
  mq,
  typesetter,
};
