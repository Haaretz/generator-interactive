import * as React from 'react';
import { useHeadingLevel, } from './HeadingLevelContext';

export default function H({ offset = 0, isH1 = false, children, ...props }) {
  const Heading = useHeadingLevel({ isH1, offset, });

  return <Heading {...props}>{children}</Heading>;
}
