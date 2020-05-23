import * as React from 'react';
import { useFela, } from 'react-fela';

export default function PullQuote({ children, extraStyles, }) {
  const { css, theme, } = useFela();
  const className = css({
    fontWeight: '300',
    letterSpacing: '0.02em',
    marginBottom: '6rem',
    textAlign: 'center',

    extend: [
      theme.type(4, { lines: 7, untilBp: 's', }),
      theme.type(5, { lines: 8, fromBp: 's', }),
    ],
  }, extraStyles);

  return (
    <blockquote className={className}>
      {children}
    </blockquote>
  );
}
