import React from 'react';
import { useFela, } from 'react-fela';
import iconStyle from '../utils/iconStyle';

export default function IconTwitter({
  size,
  fill,
  color,
  attrs,
  miscStyles,
  ...props
}) {
  const className = useFela({ size, fill, color, miscStyles, }).css(iconStyle);

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      className={className}
      {...props}
      {...attrs}
    >
      <path
        fill="currentColor"
        d="M202.4 90.7c.1 1.8.1 3.5.1 5.3 0 54.4-38.1 117.2-107.8 117.2-21.4 0-41.3-6.8-58.1-18.6 3 .4 6 .6 9 .6 17.8 0 34.1-6.5 47.1-17.6-16.6-.2-30.6-12.2-35.4-28.6 2.3.6 4.7.7 7.1.7 3.5 0 6.8-.4 10-1.4-17.3-3.8-30.4-20.5-30.4-40.4v-.6c5.1 3.1 10.9 4.9 17.2 5.1-10.2-7.3-16.9-20-16.9-34.2 0-7.6 1.9-14.6 5.1-20.7 18.7 24.9 46.7 41.3 78.1 43-.6-3-1-6.1-1-9.3 0-22.8 17-41.2 37.9-41.2 10.9 0 20.8 5 27.6 13.1 8.7-2 16.8-5.3 24.1-10-2.9 9.6-8.9 17.7-16.7 22.8 7.7-1 15-3.2 21.8-6.5-5 8.1-11.4 15.4-18.8 21.3z"
      />
    </svg>
  );
}
