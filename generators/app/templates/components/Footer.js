import { useFela, } from 'react-fela';
import * as React from 'react';

import IconAlefLogo from './IconAlefLogo';
import IconMarkerM from './IconMarkerM';
import IconHaaretzCom from './IconHaaretzComFull';
import ShareBar from './ShareBar';

import { useData, } from './DataContext';

const logos = {
  'haaretz.co.il': IconAlefLogo,
  'haaretz.com': IconHaaretzCom,
  'themarker.com': IconMarkerM,
};

export default function Footer() {
  const { site, } = useData();
  const { css, theme, } = useFela();

  const Logo = logos[site];

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
          <Logo size={8} color={[ 'brand', '-1', ]} />
        </div>
        <ShareBar wrapperStyles={{ position: 'relative', }} />
      </div>
    </footer>
  );
}
