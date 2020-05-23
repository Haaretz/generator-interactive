import * as React from 'react';

import Head from 'next/head';
import { useData, } from './DataContext';

const HTZ_DOMAIN = 'haaretz.co.il';
const TM_DOMAIN = 'themarker.com';
const HDC_DOMAIN = 'haaretz.com';

export default function ChartbeatInit() {
  const { article, section, site, } = useData();
  const { authors, } = article;
  const lowerCaseSite = site.toLowerCase();

  const domain = lowerCaseSite.includes(HDC_DOMAIN)
    ? HDC_DOMAIN
    : lowerCaseSite.includes(TM_DOMAIN)
      ? TM_DOMAIN
      : HTZ_DOMAIN;

  /* eslint-disable react/no-danger */
  return (
    <Head>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `var _sf_async_config = _sf_async_config || {};
/** CONFIGURATION START **/
_sf_async_config.uid = 5952;
_sf_async_config.domain = "${domain}";
_sf_async_config.flickerControl = false;
_sf_async_config.useCanonical = true;
_sf_async_config.useCanonicalDomain = true;
_sf_async_config.sections = '${section.name}';
_sf_async_config.authors = '${authors
      .map(author => author.contentName)
      .join(',')}';
var _sf_startpt = (new Date()).getTime();
/** CONFIGURATION END **/
(function() {
  function loadChartbeat() {
    var e = document.createElement('script');
    e.setAttribute('language', 'javascript');
    e.setAttribute('type', 'text/javascript');
    e.setAttribute('src','https://s3.amazonaws.com/static.chartbeat.com/js/chartbeat.js');
    document.body.appendChild(e);
  }
  window.addEventListener('load', loadChartbeat)
})();`,
        }}
      />
      <script async src="//static.chartbeat.com/js/chartbeat_mab.js" />
    </Head>
  );
  /* eslint-enable react/no-danger */
}
