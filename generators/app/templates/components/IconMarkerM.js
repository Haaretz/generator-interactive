import React from 'react';
import { useFela, } from 'react-fela';
import iconStyle from '../utils/iconStyle';

export default function IconTheMarker({ size, fill, color, attrs, miscStyles, ...props }) {
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
        d="M128 20C68.4 20 20 68.4 20 128s48.4 108 108 108 108-48.4 108-108S187.6 20 128 20zm56 155h-26v-68.9L140.5 175h-25.1L98 106.1V175H72V80h42.8l12.8 53.8 13-53.8H184v95z" />
    </svg>
  );
}
