import React from 'react';
import { useFela, } from 'react-fela';
import iconStyle from '../utils/iconStyle';

export default function IconTwitter({ size, fill, color, attrs, miscStyle, ...props }) {
  const className = useFela({ size, fill, color, }).css(iconStyle, miscStyle);

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      className={className}
      {...attrs}
    >
      <path
        fill="currentColor"
        d="M222 100h-25V72c0-35-29-64-64-64h-10C88 8 59 37 59 72v28H34c-3 0-6 3-6 6v136c0 3 3 6 6 6h188c3 0 6-3 6-6V106c0-3-3-6-6-6zm-69 113h-50c-1 0-2-1-2-3l15-31c1-2 0-4-1-5a22 22 0 0114-40c11 1 20 9 21 20 1 9-3 16-9 20-1 1-2 3-1 5l15 31c0 2-1 3-2 3zm16-113H87V72c0-20 16-37 36-37h10c20 0 36 16 36 37v28z"
      />
    </svg>
  );
}
