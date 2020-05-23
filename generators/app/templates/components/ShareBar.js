import { useFela, } from 'react-fela';
import * as React from 'react';

import { useData, } from './DataContext';
import IconFacebookLogo from './IconFacebookLogo';
import IconTwitter from './IconTwitter';
import IconWhatsapp from './IconWhatsapp';
import VisuallyHidden from './VisuallyHidden';

export default function ShareBar() {
  const seoData = useData('seoData');
  const site = useData('site');

  const { css, theme, } = useFela();

  const wrapperClasses = css({
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  });

  const btnStyle = {
    padding: '0 0.5rem',
    verticalAlign: 'middle',
  };

  return (
    <span className={`jsSharIcons ${wrapperClasses}`}>
      <button
        type="button"
        className={`jsFbShare ${css(btnStyle)}`}
        title={
          site.toLowerCase() === 'haaretz.com'
            ? 'Share on Facebook'
            : 'שתפו בפייסבוק'
        }
      >
        <IconFacebookLogo size={5} color="facebook" />
        <VisuallyHidden>
          {site.toLowerCase() === 'haaretz.com'
            ? 'Share on Facebook'
            : 'שתפו בפייסבוק'}
        </VisuallyHidden>
      </button>
      <button
        type="button"
        id="twitterShare"
        className={`jsTwitterShare ${css(btnStyle)}`}
        title={
          site.toLowerCase() === 'haaretz.com'
            ? 'Share on Twitter'
            : 'שתפו בטוויטר'
        }
      >
        <IconTwitter size={5} color="twitter" />
        <VisuallyHidden>
          {site.toLowerCase() === 'haaretz.com'
            ? 'Share on Twitter'
            : 'שתפו בטוויטר'}
        </VisuallyHidden>
      </button>
      <a
        className={css(btnStyle, {
          extend: [ theme.mq({ until: 'l', }, { display: 'none', }), ],
        })}
        title={
          site.toLowerCase() === 'haaretz.com'
            ? 'Share on WhatsApp'
            : 'שתפו בוואטצאפ'
        }
        href={`https://web.whatsapp.com/send?text=${encodeURIComponent(
          `${seoData.ogTitle}\n${seoData.canonicalUrl}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconWhatsapp size={5} color="whatsapp" />
        <VisuallyHidden>
          {site.toLowerCase() === 'haaretz.com'
            ? 'Share on WhatsApp'
            : 'שתפו בוואטצאפ'}
        </VisuallyHidden>
      </a>
      <a
        className={css(btnStyle, {
          extend: [ theme.mq({ from: 'l', }, { display: 'none', }), ],
        })}
        title={
          site.toLowerCase() === 'haaretz.com'
            ? 'Share on WhatsApp'
            : 'שתפו בוואטצאפ'
        }
        href={`whatsapp://send?text=${encodeURIComponent(
          `${seoData.ogTitle}\n${seoData.canonicalUrl}`
        )}`}
        rel="noopener noreferrer"
      >
        <IconWhatsapp size={5} color="whatsapp" />
        <VisuallyHidden>
          {site.toLowerCase() === 'haaretz.com'
            ? 'Share on WhatsApp'
            : 'שתפו בוואטצאפ'}
        </VisuallyHidden>
      </a>
    </span>
  );
}
