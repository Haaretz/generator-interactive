import { useFela, } from 'react-fela';
import * as React from 'react';

import iconStyle from '../utils/iconStyle';


export default function IconSpeaker({ size, fill, color, attrs, miscStyle, }) {
  const className = useFela({ size, fill, color, }).css(
    iconStyle,
    {
      verticalAlign: '-0.27em',
      '&>.speaker__muteBar': {
        opacity: '0.5',
        transform: 'rotate(-45deg) translate(-0.5em, 0.2em) scale(1.1,0)',
        transformOrigin: 'top left',
        transition: 'all 0.3s',
      },
      '&.isPaused>.speaker__muteBar': {
        opacity: '1',
        transform: 'rotate(-45deg) translate(-0.5em, 0.2em) scale(1.1,1)',
      },
    },
    miscStyle
  );

  return (
    <svg
      className={`jsAutoPlayIcon isPaused ${className}`}
      {...attrs}
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
    >
      <path fill="currentColor" d="M155 187V69c0-1 1-2 3-2 23 9 39 33 39 61s-16 52-39 61c-2 0-3-1-3-2zm0-174v25l2 3c35 9 61 45 61 87s-26 78-61 87l-2 3v25c0 2 2 3 4 3 50-10 89-59 89-118S209 20 159 10c-2 0-4 1-4 3zm-29 0L55 68l-4 1H12c-2 0-4 2-4 4v110c0 2 2 4 4 4h40l4 1 70 54c2 2 6 0 6-3V16c0-3-4-5-6-3z" />
      <g className="speaker__muteBar">
        <path fill="currentColor" d="M-2.4 12h40.9v322.4H-2.4z" />
        <path d="M33.4 17v312.4H2.6V17h30.8m10-10H-7.4v332.4h50.9V7h-.1z" />
      </g>
    </svg>
  );
}
