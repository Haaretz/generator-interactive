import { useFela, } from 'react-fela';
import * as React from 'react';

import Caption from './Caption';
import Image, { Picture, } from './Image';

/**
 * An image inside the article body
 * @param {Object} props
 * @param {Object} props.data
 *   Image data from the model
 *  @param {string|Array<{ from?: 's'|'m'|'l'|'xl', size: string, }>} [props.sizes]
 *    An array of objects to generate the `sizes` attribute from.
 *    Each item must have a `size` key with a string representing the
 *    size of the image and an optional `from` key, with a string of
 *    the name of one of the named breakpoints, indicating what is the
 *    minimum breakpoint the size applies to.
 *  @param {number[]} widths
 *    An array of image widths available for the `src` and `srcset` attributes
 *  @param {boolean} isLazyload
 *    Should the image be lazyloaded
 */
export default function ArticleImage({
  data,
  sizes,
  widths,
  isLazyload = true,
} = {}) {
  const { css, theme, } = useFela();
  const { title, credit, photographer, aspect, } = data;

  // Sort widths small to large
  const sortedWidths = widths.sort(smallToLarge);
  const isPicture = data.imgArray.length > 1;

  // If you relay on Polopoly for horizontal positioning,
  // change this to be a function of `data.position`.
  const figureClasses = css({
    extend: [
      theme.mq({ until: 's', }, { marginLeft: '-2rem', marginRight: '-2rem', }),
      theme.mq({ from: 'l', until: 'xl', }, { margin: '6rem -20rem', }),
      theme.mq({ from: 'xl', }, { margin: '6rem -30rem', }),
    ],
  });
  const baseOptions = {
    aspect,
    sizes,
    widths: sortedWidths,
  };
  const options = isPicture
    ? [
      {
        ...baseOptions,
        positionInImgArray: 1,
      },
      {
        ...baseOptions,
        from: 's',
        positionInImgArray: 0,
      },
    ]
    : baseOptions;
  const props = {
    data,
    options,
    isLazyload,
  };

  const ImageElement = isPicture ? Picture : Image;

  return (
    <figure className={figureClasses}>
      <ImageElement {...props} />
      <Caption caption={title} credit={credit || photographer} />
    </figure>
  );
}

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function smallToLarge(a, b) {
  if (a == null) return 1;
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
