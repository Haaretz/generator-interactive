import * as React from 'react';
import config from 'config';
import { POLYFILL_SRC, } from '../consts/index';

import preload from '../public/preload.json';

const preloadScripts = [ ...new Set(
  Object.entries(preload)
    .reduce((modules, entry) => (
      entry[0] === 'styles'
        ? modules
        : [
          ...modules,
          ...entry[1],
        ]
    ), [])
), ];

export default function PreloadJS() {
  return [
    (
      <link
        rel="preload"
        crossOrigin="anonymous"
        href={POLYFILL_SRC}
        as="script"
        key="polyfillsPreload"
      />
    ),
    ...(preloadScripts.map(module => (
      <link
        rel="preload"
        as="script"
        crossOrigin="anonymous"
        href={`${config.get('pathPrefix')}${module}`}
        key={module}
      />
    ))),
  ];
}
