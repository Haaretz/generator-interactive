import * as React from 'react';
import Head from 'next/head';

export default function Favicons({ site, }) {
  const siteCode = getSiteCode(site);

  return (
    <Head>
      <link
        rel="shortcut icon"
        href={`/static/${siteCode}/images/favicon.ico`}
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`/static/${siteCode}/images/apple-touch-icon-152x152.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href={`/static/${siteCode}/images/apple-touch-icon-144x144.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href={`/static/${siteCode}/images/apple-touch-icon-120x120.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href={`/static/${siteCode}/images/apple-touch-icon-114x114.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href={`/static/${siteCode}/images/apple-touch-icon-72x72.png`}
      />

      <meta
        name="msapplication-TileColor"
        content={getSiteColor(site)}
        key="msapplication-TileColor"
      />
      <meta
        name="msapplication-TileImage"
        content={`/static/${siteCode}/images/mstile-144x144.png`}
        key="msapplication-TileImage"
      />
    </Head>
  );
}

function getSiteCode(site) {
  const siteToCode = {
    'haaretz.co.il': 'htz',
    'themarker.com': 'tm',
    'haaretz.com': 'hdc',
  };

  return siteToCode[site];
}

function getSiteColor(site) {
  const siteToColorMap = {
    'haaretz.co.il': '#0B7EB5',
    'themarker.com': '#00C800',
    'haaretz.com': '#2064FF',
  };

  return siteToColorMap[site];
}
