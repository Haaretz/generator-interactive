import React from 'react';
import { useFela, } from 'react-fela';
import { parseComponentProp, } from '@haaretz/htz-css-tools';


export const styles = ({ bgc, namedBgc, theme, }) => ({
  paddingLeft: '2rem',
  paddingRight: '2rem',

  extend: [
    theme.mq({ from: 's'}, {
      display: 'grid',
      gridTemplateColumns: `2rem 1fr 2rem`,
      paddingRight: '0',
      paddingLeft: '0',

      // By default, place each descendant element into
      // the main column.
      '& > *': {
        gridColumn: '2',
      },
      '& > .full': {
        gridColumn: '1 / -1',
      },
      '& > .pull-start': {
        gridColumn: '1 / 2',
      },
      '& > .pull-end': {
        gridColumn: '2 / 3',
      },
    }),

    parseComponentProp(
      'gridTemplateColumns',
      [
        { from: 's', until: 'm', value: getColTemplate(100), },
        { from: 'm', until: 'l', value: getColTemplate(768 / 6), },
        { from: 'l', until: 'xl', value: getColTemplate(1024 / 6), },
        { from: 'xl', value: getColTemplate((1280 - 17) / 7), },
      ],
      theme.mq
    ),
  ],
});

export default function LayoutContainer({
  attrs,
  children,
  extraClasses,
  extraStyles,
  tagName = 'section',
}) {
  const className = useFela().css(styles, extraStyles);
  const Element = tagName;
  const classes = `${extraClasses ? extraClasses +  ' ' : ''}${className}`;

  return (
    <Element className={classes} {...attrs}>
      {children}
    </Element>
  );
}

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function getColTemplate(mainColWidth) {
  const spacerCol = 'minmax(2rem, 1fr)';
  return `${spacerCol} minmax(auto, ${mainColWidth}rem) ${spacerCol}`
}
