import { useFela, } from 'react-fela';
import * as React from 'react';

import IconAlefLogo from './IconAlefLogo';
import ShareBar from './ShareBar';

export default function Footer() {
  const { css, theme, } = useFela();

  return (
    <footer
      id="pageFooter"
      className={`jsFooter ${css({
        backgroundColor: theme.color('neutral', '-10'),
        overflow: 'hidden',
        paddingTop: '10rem',
      })}`}
    >
      <div
        className={css({
          padding: '6rem 2rem 8rem',
          position: 'relative',
          textAlign: 'center',

          '&:before': {
            backgroundColor: theme.color('neutral'),
            content: '""',
            height: '100%',
            left: '0',
            top: '0',
            transform: 'skew(0deg, -3deg) scaleY(3.5) translateY(-1rem)',
            transformOrigin: 'top center',
            position: 'absolute',
            width: '100%',
          },
        })}
      >
        <div className={css({ marginBottom: '3rem', position: 'relative', })}>
          <IconAlefLogo size={8} color={[ 'brand', '-1', ]} />
        </div>
        <ShareBar isMonochrome wrapperStyles={{ position: 'relative', }} />
      </div>
    </footer>
  );
}
