import React from 'react';
import { useFela, } from 'react-fela';
import iconStyle from '../utils/iconStyle';

export default function IconHtzLoader({
  attrs,
  size,
  fill,
  color,
  extraStyles,
  idSuffix = 'default',
  ...props
}) {
  const { css, } = useFela({ color, fill, size, extraStyles, });
  const className = css(iconStyle);
  const gradientId = `htz-loader-gradient-${idSuffix}`;

  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      className={className}
      {...props}
      {...attrs}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .htz-loader-circle{
            -webkit-transform-origin:center center;
            transform-origin:center center;
            -webkit-animation:htz-loader-animation 1.5s infinite linear;
            animation:htz-loader-animation 1.5s infinite linear
          }
          @-webkit-keyframes htz-loader-animation{
            0%{
              -webkit-transform:rotate(0);
              transform:rotate(0)
            }
            100%{
              -webkit-transform:rotate(-360deg);
              transform:rotate(-360deg)
            }
          }
          @keyframes htz-loader-animation{
            0%{
              -webkit-transform:rotate(0);
              transform:rotate(0)
            }
            100%{
              -webkit-transform:rotate(-360deg);
              transform:rotate(-360deg)
            }
          }
        `,
        }}
      />
      <g className="htz-loader-circle">
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="55.8"
          y1="32.1"
          x2="189"
          y2="208.9"
        >
          <stop offset="0.6" stopColor="currentColor" />
          <stop
            offset="0.9"
            style={{ stopColor: 'currentColor', stopOpacity: 0, }}
          />
        </linearGradient>
        <path
          fill={`url(#${gradientId})`}
          d="M128 8C61.7 8 8 61.7 8 128c0 32.6 13.1 62.2 34.2 83.9l0 0c1.8 1.8 4.3 2.9 7.1 2.9 5.5 0 10-4.5 10-10 0-2.9-1.3-5.6-3.3-7.4C38.7 179.4 28 154.9 28 128 28 72.9 72.9 28 128 28c55.1 0 100 44.9 100 100 0 12.6-2.3 24.7-6.6 35.9l19.1 6.2c4.9-13.1 7.6-27.3 7.6-42.1C248 61.7 194.3 8 128 8z"
        />
      </g>
      <path
        fill="currentColor"
        d="M77.6 183.5h41c-3.5-7.5-4.9-16.2-4.1-26.3 -6.7 0-12 0-15.5 0 -5.8 0-9.2-3.1-10.4-9.2 -1.1-6.2-1.3-12-0.6-17.5 0.5-4.3 1.6-7.4 3.4-9.4 1.8-2 2.8-3 3-3l86 63.3c0-0.3 0.1-0.4 0.4-0.4s0.3-0.1 0-0.4c-1.3-2.8-2.4-5.6-3.4-8.7 -1-3-1.8-5.9-2.3-8.7 -0.5-3.8-0.7-6.6-0.6-8.5 0.1-1.9 0.6-4.7 1.3-8.5 -5-3.3-9.8-6.7-14.3-10.2 -4.5-3.5-10.1-7.5-16.6-12.1 -0.7-0.5-1.4-1.6-2.1-3.2 -0.6-1.6-0.8-3.2-0.6-4.7 0.5-2.3 1.5-4.2 3-5.6 1.5-1.5 3.2-2.3 4.9-2.3 6.5 0 14.7 0 24.8 0 -4.8-12.6-4.9-22.5-0.4-29.8 -15.6 0-27.2 0-34.9 0 0 1.3-0.2 2.7-0.6 4.3 -0.4 1.6-0.4 3.7-0.2 6.2 0 2.5 0.5 5 1.5 7.5 1 2.5 1 5.6 0 9.4 -1 3-1.9 5.3-2.8 6.8 -0.9 1.5-1.8 2.5-2.8 3 -8.1-6-17.1-12.7-27.1-20.1 -10-7.4-17.5-13-22.5-17.1h-6.8c-0.3 0-0.4 0.1-0.4 0.4 1.8 3.5 3 7.4 3.8 11.7 0.7 4.3 0.9 8.4 0.4 12.4 -0.5 5.3-1 9-1.5 11.1 -0.5 2.1-0.7 5.5-0.7 10 0 5 0.5 9.7 1.5 14.1 1 4.4 1.4 9 1.1 13.7 -0.5 7-1.3 13.3-2.5 18.6 -1.1 5.4-2.1 9.1-2.8 11.1C77 182.4 77.1 183 77.6 183.5z"
      />
    </svg>
  );
}
