import Head from 'next/head';
import React from 'react';

import { useData, } from './DataContext';
import { buildImgUrl, } from '../utils/buildImgURLs';

const twitterHandler = {
  'haaretz.co.il': '@haaretz',
  'themarker.com': '@TheMarker',
  'haaretz.com': '@haaretzcom',
}

export default function Seo() {
  const { seoData, site, } = useData();

  const {
    metaTitle,
    metaDescription,
    metaKeywords,
    ogTitle,
    canonicalUrl,
    pubDate,
    ogImage,
  } = seoData;

  const ogImageData = ogImage && ogImage.imgArray[0];
  const ogImageOptions = {
    aspect: 'landscape',
    height: 630,
    width: 1200,
  };

  const ogImageUrl
    = ogImage && buildImgUrl(ogImage.contentId, ogImageData, ogImageOptions);

  return (
    <Head>
      <title>{metaTitle + getTitleSuffix(site)}</title>
      <meta name="referrer" content="always" key="referrer" />
      <meta name="robots" content="noarchive" key="robots" />

      <meta name="title" content={metaTitle} key="title" />
      <meta name="description" content={metaDescription} key="description" />
      <meta name="keywords" content={metaKeywords} key="keywords" />
      <meta property="og:title" content={ogTitle} key="og:title" />
      <meta
        property="og:description"
        content={metaDescription}
        key="og:description"
      />
      <meta property="og:type" content="article" key="of:type" />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      {ogImageUrl ? (
        <meta property="og:image" content={ogImageUrl} key="og:image" />
      ) : null}
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta
        property="article:published"
        content={pubDate}
        key="article:published"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta name="twitter:site" content={twitterHandler[site]} key="twitter:site" />
      <meta name="twitter:title" content={ogTitle} key="twitter:title" />
      <meta
        name="twitter:description"
        content={metaDescription}
        key="twitter:description"
      />
      <meta name="twitter:image" content={ogImageUrl} key="twitter:image" />
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  );
}

function getTitleSuffix(site) {
  const siteToSuffixMap = {
    'haaretz.co.il': 'הארץ',
    'themarker.com': 'TheMarker',
    'haaretz.com': 'Haaretz',
  };

  return site ? ` - ${siteToSuffixMap[site.toLowerCase()]}` : '';
}
