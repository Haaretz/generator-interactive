import React from 'react';
import { useFela, } from 'react-fela';
import { visuallyHidden, } from '@haaretz/htz-css-tools';

const styles = visuallyHidden();

export default function VisuallyHidden({ id = null, children = null, as = 'span', }) {
  const className = useFela().css(styles);
  const Element = as;

  return (
    <Element id={id} className={className}>
      {children}
    </Element>
  );
}
