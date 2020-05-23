import { useFela, } from 'react-fela';
import React from 'react';

import iconStyle from '../utils/iconStyle';

export default function IconHaaretzComFull({
  size,
  fill,
  color,
  attrs,
  miscStyles,
  secondaryColor,
  ...props
}) {
  const className = useFela({ size, fill, color, miscStyles, }).css(iconStyle);

  return (
    <svg
      className={className}
      width="7.89em"
      height="1em"
      viewBox="0 0 364.5 46.18"
      {...props}
      {...attrs}
    >
      <path
        fill="currentColor"
        d="M99.12 46.17v-1.42c2.72-.26 3.84-1.3 5.77-6.16L120.07 0h4.65l16.79 41.37c1.19 2.85 1.73 3.18 3.91 3.38v1.42h-23.88v-1.42h3a2.42 2.42 0 002.71-2.4 9.56 9.56 0 00-.73-3.12l-3.11-7.72h-12.56l-2.38 6.68a9.93 9.93 0 00-.86 3.63c0 1.7 1.13 2.93 5.18 2.93v1.42zm18-30.87l-5.31 13.62h10.55zm-48.19 8.57v14.78c0 4.48 1.69 6 5.28 6.1v1.42H50.25v-1.42c4.13 0 5.74-1.11 5.74-6.1V7.52c0-5-1.68-6.09-5.74-6.09V0h24v1.42c-3.59.13-5.28 1.61-5.28 6.09v13.24h13.51V7.52c0-4.47-1.68-6-5.27-6.09V0h24v1.42c-4.13 0-5.75 1.1-5.75 6.09v31.13c0 5 1.62 6.09 5.75 6.09v1.44H77.25v-1.42c3.59-.13 5.27-1.62 5.27-6.1V23.87zm147.93 22.3l-11-21h-1.33v13.48c0 5 1.63 6.1 5.81 6.1v1.42h-24.66v-1.42c4.18 0 5.81-1.11 5.81-6.1V7.52c0-5-1.63-6.09-5.81-6.09V0h24.57c11.26 0 16.84 4.28 16.84 12.64 0 6.3-3.27 9.47-8.41 11.67l8.84 16.41c1.45 2.65 2.36 3.89 5.27 4v1.42zM204.58 22.3c6.78 0 9.81-1.42 9.81-9.27 0-8.11-2.54-10.19-9.81-10.19zm27.84 23.87v-1.42c4.4 0 6.12-1.11 6.12-6.1V7.52c0-5-1.72-6.09-6.12-6.09V0h39.54v12.71h-1.4c-.71-7-3.83-9.87-11.1-9.87h-7.14v18.42c6.5 0 8-2.2 8.92-9.85h1.4v22.43h-1.39c-.89-7.65-2.42-9.85-8.92-9.72v15.83c0 2.46.51 3.37 3.19 3.37h5.62c4.21 0 9.57-.91 12.12-10.76h1.59l-2.31 13.61zm52.52 0v-1.42c4.49 0 6.24-1.11 6.24-6.1V2.86c-10.41 0-11.71 1.69-12.62 9.08h-1.44V0h42.13v11.92h-1.4c-.91-7.38-2.21-9.08-12.62-9.08v35.8c0 5 1.75 6.09 6.24 6.09v1.44zm36.26 0l25.88-43.33h-8.83c-6.83 0-10.12 1.76-12.35 10.12h-1.45l.88-13h38.44l-25.94 43.36h10.59c4.46 0 11.76-1.29 14.64-12.71h1.44l-1.83 15.56zm-179.82 0v-1.42c2.72-.26 3.85-1.3 5.77-6.16L162.34 0h4.64l16.79 41.37c1.19 2.85 1.73 3.18 3.91 3.38v1.42H163.8v-1.42h3a2.42 2.42 0 002.72-2.4 9.82 9.82 0 00-.73-3.12l-3.12-7.72h-12.55l-2.39 6.68a9.93 9.93 0 00-.86 3.63c0 1.7 1.13 2.93 5.18 2.93v1.42zm18-30.87l-5.31 13.62h10.56z"
      />
      <path
        fill={secondaryColor || 'currentColor'}
        d="M43 22.23a20.87 20.87 0 01-1.68 8.35 21.67 21.67 0 01-11.46 11.47 21.64 21.64 0 01-16.72 0A21.67 21.67 0 011.68 30.58a21.62 21.62 0 010-16.71A21.7 21.7 0 0113.14 2.41a21.64 21.64 0 0116.72 0 21.7 21.7 0 0111.46 11.46A20.92 20.92 0 0143 22.23zm-10.33 7.35c-.06-.44-.1-.81-.13-1.09a3 3 0 01.05-.84 4 4 0 01.08-.84c.06-.28.11-.61.17-1a14.54 14.54 0 01-1.59-1.15q-.75-.58-1.59-1.17c-.56-.39-1.14-.81-1.72-1.26s-1.25-.93-2-1.43a1.47 1.47 0 01-.46-.71 2.06 2.06 0 01-.13-1.05 2.43 2.43 0 01.68-1.26 1.49 1.49 0 011.09-.51h5.54q-1.59-4.2-.08-6.63h-7.8a4.55 4.55 0 01-.13 1 4.42 4.42 0 000 1.39 2.63 2.63 0 00.12.8 4.55 4.55 0 01.21.88 7.84 7.84 0 01.13.92 3.43 3.43 0 01-.13 1.18 8.07 8.07 0 01-.63 1.51 1.53 1.53 0 01-.63.67c-.89-.67-1.87-1.4-2.94-2.18l-3.1-2.27c-1-.78-2-1.51-2.86-2.18s-1.62-1.23-2.18-1.68h-1.55c-.06 0-.09 0-.09.08a5.94 5.94 0 01.55 1.26 7.24 7.24 0 01.29 1.35c.06.44.1.91.13 1.38a8 8 0 010 1.39c-.06.56-.12 1-.17 1.42s-.11.76-.17 1.1a7.55 7.55 0 00-.13.92v1.26a9.18 9.18 0 00.13 1.6c.08.5.15 1 .21 1.51s.19 1 .25 1.51a7 7 0 010 1.59c-.06.79-.13 1.53-.21 2.23s-.18 1.33-.29 1.89-.23 1.13-.34 1.55a4.59 4.59 0 01-.34 1 .39.39 0 00.09.42h9.15a11.68 11.68 0 01-.92-5.88h-3.52a1.87 1.87 0 01-1.46-.68 3.47 3.47 0 01-.8-1.51 7.63 7.63 0 01-.3-1.89 9.59 9.59 0 01.13-2 3.78 3.78 0 01.76-2.1c.39-.45.61-.67.67-.67l19.14 14.17c0-.06 0-.09.08-.09s.06 0 0-.08a9.31 9.31 0 00-.38-1c-.14-.31-.26-.63-.38-1s-.21-.68-.29-1-.15-.6-.21-.83z"
      />
    </svg>
  );
}
