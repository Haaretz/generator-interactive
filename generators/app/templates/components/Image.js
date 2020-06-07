import { useFela, } from 'react-fela';
import * as React from 'react';

import { buildImgUrl, buildImgUrls, } from '../utils/buildImgURLs';
import { useData, } from './DataContext';
import getImageAssets from '../utils/getImageAssets';
import getImgWidthHeight from '../utils/getImgWidthHeight';

////////////////////////////////////////////////////////////////////////
//                          TYPE DEFINITIONS                          //
////////////////////////////////////////////////////////////////////////

/**
 * A named breakpoint
 * @typedef {'s'|'m'|'l'|'xl'} BpName
 */

/**
 * The actual physical size the image is rendered in on the screen
 * (so not the width of the file), in css width units.
 * @typedef {string} Size
 */

/**
 * options for a size in an `img` or `source` element's `sizes` attribute
 * @typedef {Object} SizeOptions
 * @property {Size} size
 *   The size the image is rendered in on the screen at a given breakpoint,
 *   in css width units.
 *   Notice, this is the actual physical the image occupies *on the screen,*
 *   so not the width of the file, which is specified in the `srcset` attribute.
 * @property {BpName} [from]
 *   A named  breakpoint to serve as the min-width cutoff of the current size
 */

/**
 * Options for an individual `source` of a picture element.
 * Applies to both the fallback `img` and each of the `source`s.
 * @typedef {Object} SourceOptions
 * @property {'full'|'regular'|'headline'|'landscape'|'square'|'vertical'|'belgrade'} aspect
 *   The aspect ratio to render the image in
 * @property {Size|SizeOptions[]} [sizes]
 *   The size(s) for the `img` or `source` element's `sizes` attribute.
 *     * Browsers use the first specified size with a media query that matches
 *       the screen, so min-width conditions must be specified in large-small
 *       order, e.g., { size: x, from: 'xl', } should precede { size: y, from 'l', }
 *       in the array.
 *     * When `sizes` is an array, the last element should not have a `from` key, and serves
 *       as the default value.
 *     * When `sizes` is a single string match in all screens.
 *     * Browsers consider the lack of a `sizes` attribute as `100vw` on all breakpoints.
 * @property {number[]} widths
 *   The width, in pixels, of each source-file for the `src` and `srcset` attributes.
 *   Notice, This is the width of the image file, not the width it will be
 *   rendered in on the screen, which is specified in the `sizes` attribute.
 * @property {BpName} [from]
 *   A named breakpoint for the min-width value of a `source` element's `media`
 *   attribute. Only relevant on `source` elements and ignored on `img` elements.
 * @property {BpName} [until]
 *   A named breakpoint for the max-width value of a `source` element's `media`
 *   attribute. Only relevant on `source` elements and ignored on `img` elements.
 * @param {number} [positionInImgArray]
 *   The position of the data in the imgArray from the model.
 */

////////////////////////////////////////////////////////////////////////
//                             COMPONENTS                             //
////////////////////////////////////////////////////////////////////////

/**
 * An img or source element
 * ---------
 * @param {Object} props
 * @param {Object} props.data
 *   The element's data from the model (papi)
 * @param {SourceOptions} props.options
 *   Properties of the `img` or `source` element.
 *     * The first item in the array will be used to construct the fallback
 *       `img`, and should *not* contain the `from` or `until` properties.
 *     * The rest of the items are used to construct `source` elements.
 *       Source elements are used by browsers based on the *first* media query
 *       that matches the screen, so:
 *       * sources with a `from` property should be specified in a large to small
 *         order, e.g., `{ ..., from: 'xl', }` should preceed `{ ..., from: 'l', }, ]`.
 *       * sources with an `until` property should be specified in a small to large
 *         order, e.g., `{ ..., from: 'l', }` should preceed `{ ..., from: 'xl', }, ]`.
 * @param {'img'|'source'} [props.as='img']
 *   The rendered element's tagName.
 * @param {Object|function} props.extraStyles
 *   A css-in-js object or a function of theme returning one, to compose with
 *   the base styles of the component.
 * @param {boolean} [removeTitle=false]
 *   Omit the `title` attribute.
 * @param {boolean} [props.isLazyload=false]
 *   Should the image be lazyloaded
 * @param {boolean} [isPresentational=false]
 *   Marks the image as presentational instructing assistive technology to
 *   ignore it.
 * @param {Object} [attrs]
 *   Additional attributes to pass to the html element.
 */
export default function Image({
  data,
  options,
  as = 'img',
  extraStyles = null,
  removeTitle = false,
  isLazyload = false,
  isPresentational = false,
  attrs = null,
}) {
  const { css, theme, } = useFela();
  const site = useData('site');
  const { bps, } = theme;
  const { aspect, widths, from, until, positionInImgArray = 0, } = options;

  if (isPresentational && attrs && (!!attrs.role || !!attrs['aria-hidden'])) {
    // eslint-disable-next-line no-console
    console.trace(
      'When "isPresentational" prop value is true, "role" and "aria-hidden" are set automatically'
    );
  }

  const isSource = as === 'source';
  const Element = as;
  const imgData = data.imgArray[positionInImgArray];
  const { sizes, transforms, } = getImageAssets({
    aspect,
    bps,
    sizes: options.sizes,
    widths,
  });
  const hasSrcset = transforms.length > 1;
  const contentId = data.contentId;

  const title = isSource || removeTitle ? null : getTitle(data, site);

  // A `source` element is not allowed an `src` attribute:
  const src = isSource ? null : buildImgUrl(contentId, imgData, transforms[0]);
  const srcset = hasSrcset
    ? buildImgUrls(contentId, imgData, transforms)
    : undefined;
  const attrsPrefix = isLazyload ? 'data-' : '';
  const srcsetAttr = isLazyload ? 'srcset' : 'srcSet';
  const { width, height, } = getImgWidthHeight(data.imgArray[0].aspects, aspect);
  const alt = isSource ? null : data.accesibility;

  const imgAttrs = {
    [`${attrsPrefix}src`]: src,
  };

  // Add img attributes
  if (hasSrcset) imgAttrs[`${attrsPrefix}${srcsetAttr}`] = srcset;
  if (isLazyload) imgAttrs.loading = 'lazy';
  if (isSource) imgAttrs.media = getMedia(from, until, theme.getMqString);
  if (isPresentational) {
    imgAttrs['aria-hidden'] = true;
    imgAttrs.role = 'presentation';
  }

  const className
    = (isLazyload ? 'lazyload ' : '')
    + (isSource
      ? ''
      : css(
        {
          maxWidth: '100%',
          width: '100%',
          height: 'auto',

          ...(isLazyload
            ? {
              transition: 'opacity .3s ease-out',
              opacity: '0',
              '&.lazyloaded': {
                opacity: '1',
              },
            }
            : {}),
        },
        extraStyles
      ));

  return (
    <Element
      className={className || null}
      height={height}
      width={width}
      sizes={sizes}
      alt={alt}
      title={title}
      {...imgAttrs}
      {...attrs}
    />
  );
}

/**
 * A picture element
 * ---------
 * @param {Object} props
 * @param {Object} props.data
 *   The element's data from the model (papi)
 * @param {SourceOptions[]} props.options
 *   An array defining properties of `img` and `source` elements.
 *     * The first item in the array will be used to construct the fallback
 *       `img`, and should not contain the `from` or `until` properties.
 *     * The rest of the items are used to construct `source` elements.
 *       Source elements are used by browsers based on the *first* media query
 *       that matches the screen, so:
 *       * sources with a `from` property should be specified in a large to small
 *         order, e.g., `{ ..., from: 'xl', }` should preceed `{ ..., from: 'l', }, ]`.
 *       * sources with an `until` property should be specified in a small to large
 *         order, e.g., `{ ..., from: 'l', }` should preceed `{ ..., from: 'xl', }, ]`.
 * @param {Object|function} props.extraStyles
 *   A css-in-js object or a function of theme returning one, to compose with
 *   the base styles of the component.
 * @param {boolean} [props.isLazyload=false]
 *   Should the image be lazyloaded
 * @param {boolean} [removeTitle=false]
 *   Omit the `title` attribute.
 * @param {boolean} [isPresentational=false]
 *   Marks the image as presentational instructing assistive technology to
 *   ignore it.
 * @param {Object} [attrs]
 */
export function Picture({
  data,
  options,
  extraStyles = null,
  isLazyload = false,
  removeTitle = false,
  isPresentational = false,
  attrs = null,
}) {
  if (options.length <= 1) {
    // eslint-disable-next-line no-console
    console.trace(
      'Looks like you aren\'t using <source>s. Try using Image instead if Picture'
    );
    return null;
  }

  const sourcesOpts = options.slice(1);

  return (
    <picture>
      {sourcesOpts.map(sourceOpts => (
        <Image
          as="source"
          data={data}
          options={sourceOpts}
          removeTitle
          isLazyload={isLazyload}
          key={
            data.contentId
            + data.imgArray[sourceOpts.positionInImgArray || 0].imgName
          }
        />
      ))}
      <Image
        data={data}
        options={options[0]}
        isLazyload={isLazyload}
        removeTitle={removeTitle}
        extraStyles={extraStyles}
        isPresentational={isPresentational}
        attrs={attrs}
      />
    </picture>
  );
}

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function getTitle({ title, credit, }, site) {
  const creditPrefix = site === 'haaretz.com' ? 'credit' : 'צילום';

  return `${title || ''}${title && credit ? '. ' : ''}${
    credit ? `${creditPrefix}: ${credit}` : ''
  }`;
}

function getMedia(from, until, getMqString) {
  if (from != null || until != null) return getMqString({ from, until, }, true, true);
  return undefined;
}
