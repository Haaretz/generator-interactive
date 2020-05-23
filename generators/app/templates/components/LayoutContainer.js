import React from 'react';
import { useFela, } from 'react-fela';
import { parseComponentProp, } from '@haaretz/htz-css-tools';

export const styles = ({ bgc, namedBgc, theme, }) => ({
  marginRight: 'auto',
  marginLeft: 'auto',
  width: '100%',
  padding: '0 2.6rem',
  extend: [
    parseComponentProp(
      'maxWidth',
      [
        { from: 's', until: 'm', value: 100, },
        { from: 'm', until: 'l', value: 768 / 6, },
        { from: 'l', until: 'xl', value: 1024 / 6, },
        { from: 'xl', value: (1280 - 17) / 7, },
      ],
      theme.mq
    ),
  ],
});

export default function LayoutContainer({
  attrs,
  bgc,
  namedBgc,
  children,
  miscStyles,
  tagName = 'section',
}) {
  const className = useFela({ bgc, namedBgc, }).css(styles, miscStyles || {});
  const Tag = tagName;
  return (
    <Tag {...attrs} className={className}>
      {children}
    </Tag>
  );
}
