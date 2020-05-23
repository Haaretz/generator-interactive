export default async function lazyloadImage() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = Array.from(document.querySelectorAll('[loading="lazy"]'));
    images.forEach(img => {
      if (img.tagName.toLowerCase() === 'img') {
        // add `lazyloaded` class to image once it has loaded
        img.addEventListener('load', () => {
          img.classList.add('lazyloaded');
        });
      }

      // populate `src` and `srcset` from `data-` attributes
      const { src, srcset, } = img.dataset;
      // eslint-disable-next-line no-param-reassign
      if (srcset) img.srcset = srcset;
      // eslint-disable-next-line no-param-reassign
      if (src) img.src = src;
    });
  }
  else {
    // eslint-disable-next-line no-console
    console.log(
      '[htz]: Native lazyloading is not supported by the browser.',
      'Loading lazysizes...'
    );
    // eslint-disable-next-line no-unused-vars
    const lazySizesLib = await import('lazysizes');

    // lazysizes adds a global, so initializing that instead of the module reference
    // eslint-disable-next-line no-undef
    lazySizes.init();
  }
}
