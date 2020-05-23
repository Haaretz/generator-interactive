import { getMqString, } from '@haaretz/htz-css-tools';

export default function getImageAssets({
  bps,
  sizes,
  aspect,
  widths,
}) {
  const sizesString = typeof sizes === 'string'
    ? sizes
    : sizes.reduce(
      (result, sizeOpts, i) => `${result}${
        sizeOpts.from
          ? `${getMqString(bps, { from: sizeOpts.from, }, true)} ${
            sizeOpts.size
          }`
          : sizeOpts.size
      }${i === sizes.length - 1 ? '' : ','}`,
      ''
    );

  return {
    sizes: sizesString,
    transforms: widths.map(width => ({ width: width.toString(), aspect, })),
  };
}
