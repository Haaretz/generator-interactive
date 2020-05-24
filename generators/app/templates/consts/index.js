import splitUrl from '../utils/splitUrl';

/**
 * The full urls of where the pages will eventually be deployed.
 * Serves as the data source for `getStaticProps`
 * FULL URLS ONLY
 * -------------------------
 * @type {Array<string>}
 * -------------------------
 *  @example
 * export const PAGES = [
 *   'https://www.haaretz.co.il/health/corona/.premium-MAGAZINE-1.8802422',
 *   'https://www.haaretz.co.il/health/corona/.premium-1.8805016',
 * ];
 * -------------------------
 */
export const PAGES = [
];

/**
 * The application's language
 * -------------------------
 * @type {'he'|'en'}
 * -------------------------
 */
export const LANG = '<%= langCode %>';

export const PAGES_URL_PARTS = (pages => {
  if (!pages.length) {
    throw new Error('no urls are defined in the "PAGES" array. See "consts/index.js"');
  }

  return pages.map(url => {
    const { baseUrl, fullMatch, path = '', domain, } = splitUrl(url);
    const id = (path.match(/^.*\/.*?(\d\.\d+)/) || [])[1];
    const papiurl = `${baseUrl}/papi${path}`;

    return {
      id,
      path,
      url: fullMatch,
      domain: domain?.toLowerCase(),
      papiurl,
    };
  });
})(PAGES);

export const PAGE_CONFIG = {
  unstable_runtimeJS: false,
};

export const POLYFILL_SRC
  = 'https://polyfill.io/v3/polyfill.min.js?flags=gated&unknown=polyfill&features=IntersectionObserver%2CIntersectionObserverEntry%2Cdefault%2CObject.entries%2CArray.prototype.entries%2Cfetch%2CArray.prototype.find%2CArray.prototype.findIndex%2CArray.prototype.includes%2CFunction.prototype.name%2CArray.prototype.%40%40iterator';
