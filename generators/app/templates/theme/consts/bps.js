const bps = Object.freeze({
  widths: Object.freeze({
    s: 600,
    m: 768,
    l: 1024,
    xl: 1280,
  }),
  misc: Object.freeze({
    landscape: '(orientation: landscape)',
    portrait: '(orientation: portrait)',
    hidpi: '(min-resolution: 1.5dppx)',
  }),
});

export default bps;
