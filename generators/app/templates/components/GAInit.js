import * as React from 'react';
import Head from 'next/head';

export default function GAInit({ site, }) {
  /* eslint-disable react/no-danger */
  return (
    <Head>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', '${getSiteCode(site)}', 'auto', { allowLinker: true });
  ga('require', 'ec'); `,
        }}
      />
    </Head>
  );
  /* eslint-enable react/no-danger */
}

function getSiteCode(site) {
  const siteToCode = {
    'haaretz.co.il': 'UA-589309-3',
    'themarker.com': 'UA-589309-2',
    'haaretz.com': 'UA-3574867-1',
  };

  return siteToCode[site];
}
