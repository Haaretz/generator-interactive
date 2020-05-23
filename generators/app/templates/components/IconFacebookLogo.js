import React from 'react';
import { useFela, } from 'react-fela';
import iconStyle from '../utils/iconStyle';

export default function IconFacebookLogo({ size, fill, color, attrs, miscStyles, ...props }) {
  const className = useFela({ size, fill, color, miscStyles, }).css({
    padding: '3px',
    width: '100%',
    ...iconStyle,
  });

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 310" className={className} {...props} {...attrs}>
      <path fill="currentColor" d="M81.7 165.1h34V305a5 5 0 005 5h57.6a5 5 0 005-5V165.8h39a5 5 0 005-4.5l6-51.5a5 5 0 00-5-5.5h-45V72c0-9.8 5.2-14.7 15.6-14.7h29.4a5 5 0 005-5V5a5 5 0 00-5-5h-42.4c-7 0-31.5 1.4-50.8 19.2a53.3 53.3 0 00-17.7 47.3v37.8H81.7a5 5 0 00-5 5V160a5 5 0 005 5z" />
    </svg>
  );
}
