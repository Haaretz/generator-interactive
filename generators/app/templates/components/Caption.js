import React from 'react';
import { useFela, } from 'react-fela';
import { useData, } from './DataContext';

function CaptionWrapper({ styles, children, }) {
  const { css, theme, } = useFela();
  const className = css(
    {
      wordBreak: 'break-word',
      fontWeight: '700',
      extend: [ theme.type(-2), theme.mq({ until: 's', }, { padding: '0 2rem', }), ],
    },
    styles
  );

  return <figcaption className={className}>{children}</figcaption>;
}

function Credit({ children, styles, }) {
  const { css, } = useFela();
  const className = css(
    {
      display: 'inline',
      flexShrink: '0',
      fontWeight: '300',
    },
    styles
  );

  return <span className={className}>{children}</span>;
}

export default function Caption({
  caption,
  credit,
  creditPrefix,
  creditStyles,
  captionStyles,
}) {
  const site = useData('site');
  if (!caption && !credit) return null;
  const prefix = creditPrefix || (site === 'haaretz.com' ? 'credit' : 'צילום');

  return (
    <CaptionWrapper styles={captionStyles}>
      {caption}
      {credit ? (
        <Credit styles={creditStyles}>{`${prefix}: ${credit}`}</Credit>
      ) : (
        ''
      )}
    </CaptionWrapper>
  );
}
