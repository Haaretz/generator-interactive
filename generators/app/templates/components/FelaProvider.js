import * as React from 'react';
import { StyleProvider, } from '@haaretz/fela-utils';
import { theme, } from '../theme/index';
import getFelaRenderer from '../utils/getFelaRenderer';

const fallbackRenderer = getFelaRenderer();

export default function FelaProvider({ renderer = fallbackRenderer, children, }) {
  return (
    <StyleProvider renderer={renderer} theme={theme}>
      {children}
    </StyleProvider>
  );
}
