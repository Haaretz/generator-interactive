import * as React from 'react';
import { useHeadingLevel, } from './HeadingLevelContext';

export default function H({ offset = 0, isH1 = false, children, ...props } = {}) {
  const headingLevel = useHeadingLevel({ isH1, offset, });
  const Heading = `h${headingLevel}`;

  return <Heading {...props}>{children}</Heading>;
}
