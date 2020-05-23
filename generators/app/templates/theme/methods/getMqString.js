import { getMqString, } from '@haaretz/htz-css-tools';
import bps from '../consts/bps';

export default function mqString(query, noMediaPrefix, pixelOutput) {
  return getMqString(bps, query, noMediaPrefix || false, pixelOutput);
}
