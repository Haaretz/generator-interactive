import * as React from 'react';
import { useHeadingLevel, HeadingLevelProvider, } from './HeadingLevelContext';

export default function Section({ children = null, as = 'section', ...props }) {
  const currentHeadingLovel = useHeadingLevel();
  const Element = as;

  return (
    <HeadingLevelProvider value={currentHeadingLovel + 1}>
      <Element {...props}>{children}</Element>
    </HeadingLevelProvider>
  );
}
