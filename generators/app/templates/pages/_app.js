import * as React from 'react';

import { HeadingLevelProvider, } from '../components/HeadingLevelContext';
import FelaProvider from '../components/FelaProvider';

export default function CustomApp({ Component, pageProps, renderer, }) {
  return (
    <HeadingLevelProvider value={1}>
      <FelaProvider renderer={renderer}>
        <Component {...pageProps} />
      </FelaProvider>
    </HeadingLevelProvider>
  );
}
