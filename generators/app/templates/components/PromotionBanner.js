import { rgba, } from '@haaretz/htz-css-tools';
import { useFela, } from 'react-fela';
import * as React from 'react';

import Astronaut from './Astronaut';

export default function PromotionBanner() {
  const { css, theme, } = useFela();

  const outerWrapperClasses = css({
    backgroundImage: `linear-gradient(180deg, ${rgba(
      theme.color('neutral', '-10'),
      0
    )} 0%, ${theme.color('neutral', '-10')} 20%)`,
    marginBottom: '2rem',
    marginTop: '-20rem',
    paddingTop: '30rem',
    position: 'relative',
  });
  const innerWrapperClasses = css({
    borderTop: `4rem solid ${theme.color('quaternary', '-1')}`,
    position: 'relative',
    paddingTop: '1rem',
    textAlign: 'center',
  });

  const astroClasses = css({
    left: '50%',
    position: 'absolute',
    top: '-25rem',
    transform: 'translate(-50%, 0)',
    height: '25rem',
    overflow: 'hidden',
  });

  const headerClasses = css({
    marginTop: '2rem',
    fontWeight: '700',
    // color: theme.color(...fgColor),
    // color: theme.color('green', '+2'),
    extend: [ theme.type(4, { lines: 7, }), ],
  });
  const ctaClasses = css({
    display: 'inline-block',
    marginTop: '3rem',
    backgroundColor: theme.color('sales', '+2'),
    borderBottomStyle: 'none !important',
    padding: '0.5rem 2rem',
    fontWeight: '700',

    '&:hover': {
      backgroundColor: theme.color('sales'),
      color: `${theme.color('bodyText')} !important`,
    },
    '&:focus': {
      backgroundColor: theme.color('sales', 'base'),
      color: `${theme.color('bodyText')} !important`,
    },

    extend: [
      // theme.type(2),
      theme.type(3, { untilBp: 'm', }),
      theme.type(2, { fromBp: 'm', untilBp: 'l', }),
      theme.type(3, { fromBp: 'l', untilBp: 'xl', }),
      theme.type(2, { fromBp: 'xl', }),
    ],
  });

  const loginClasses = css({
    borderBottom: `1px solid ${theme.color('brand')}`,
    display: 'none',
    marginTop: '2rem',

    '&:hover': {
      borderBottom: 'none',
      color: theme.color('brand'),
    },
    '&:focus': {
      borderBottom: 'none',
      color: theme.color('brand'),
    },
    '&:active': {
      borderBottom: 'none',
      color: theme.color('brand'),
    },

    '&.isLoggedOut': {
      display: 'inline-block',
    },

    extend: [ theme.type(-1), ],
  });

  return (
    <aside className={outerWrapperClasses}>
      <div className={innerWrapperClasses}>
        <div className={astroClasses}>
          <Astronaut size={50} />
        </div>
        <h2>כתבה זו זמינה למנויים בלבד</h2>
        <p className={headerClasses}>רוצים להמשיך לקרוא?</p>

        <a
          id="purchaseBtn"
          href="https://promotions.haaretz.co.il/promotions-page/?htm_source=site&htm_medium=interactive&htm_campaign=climate_project19&htm_campaign_type=purchase&htm_content=4.90_nis"
          className={ctaClasses}
        >
          רכשו מינוי
        </a>
        <br />
        <a
          id="loginLink"
          href="https://login.haaretz.co.il"
          className={loginClasses}
        >
          כבר מנויים? התחברו
        </a>
      </div>
    </aside>
  );
}
