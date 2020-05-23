import * as React from 'react';
import Head from 'next/head';

export default function FacebookInit({ site, }) {
  /* eslint-disable react/no-danger */
  return (
    <Head>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${getSiteCode(
            site
          )}');fbq('track', 'PageView');`,
        }}
      />
    </Head>
  );
  /* eslint-enable react/no-danger */
}

function getSiteCode(site) {
  const siteToCode = {
    'haaretz.co.il': '801998859871552',
    'themarker.com': '335945660336305',
    'haaretz.com': '307252476589397',
  };

  return siteToCode[site];
}
