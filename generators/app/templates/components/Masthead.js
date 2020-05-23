import { useFela, } from 'react-fela';
import * as React from 'react';

import VisuallyHidden from './VisuallyHidden';
import IconHaaretzCom from './IconHaaretzCom';
import IconHaaretzLogo from './IconHaaretzLogo';
import IconTheMarkerLogo from './IconTheMarkerLogo';
import { useData, } from './DataContext';

export default function Masthead() {
  const { css, theme, } = useFela();

  const headerClasses = css({
    display: 'flex',
    justifyContent: 'center',
    left: '0',
    top: '0',
    width: '100%',
    marginBottom: '1.25em',
    zIndex: theme.getZIndex('masthead'),

    extend: [
      theme.mq(
        { misc: 'landscape', },
        {
          position: 'absolute',
        }
      ),
    ],
  });

  return (
    <header id="masthead" className={headerClasses}>
      <a href="/">
        <SiteLogo
          // color="primary"
          size={4}
        />
        <LogoA11y />
      </a>
    </header>
  );
}

function SiteLogo({ site, ...props }) {
  const { site: siteFromData, } = useData();
  const logos = {
    'haaretz.co.il': IconHaaretzLogo,
    'haaretz.com': IconHaaretzCom,
    'themarker.com': IconTheMarkerLogo,
  };
  const Logo = logos[site || siteFromData];

  return <Logo {...props} />;
}

function LogoA11y({ site, }) {
  const { site: siteFromData, } = useData();
  const text = {
    'haaretz.co.il': 'לדף הבית של הארץ',
    'haaretz.com': 'Haaretz - Israel News',
    'themarker.com': 'לדף הבית של TheMarker',
  };
  return <VisuallyHidden>{text[site || siteFromData]}</VisuallyHidden>;
}
