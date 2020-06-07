import React from 'react';
import { useFela, } from 'react-fela';
import iconStyle from '../utils/iconStyle';

export default function IconFacebookLogo({
  size,
  fill,
  color,
  attrs,
  extraStyles,
  ...props
}) {
  const className = useFela({ size, fill, color, extraStyles, }).css(iconStyle);

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
        d="M211 59v143.1c0 4.9-4 8.9-8.9 8.9H165v-63h18.7l2.7-24H165v-16.3c0-5.7 2.9-7.7 5.5-7.7H187V76h-21.6c-22.9 0-27.4 18.2-27.4 30.1V124h-15v24h15v63H59.8c-6 0-10.8-4.9-10.8-11V59.7C49 53.8 53.8 49 59.6 49H201c5.5 0 10 4.5 10 10z"
      />
    </svg>
  );
}
