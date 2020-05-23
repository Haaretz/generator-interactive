import * as React from 'react';

import { DataProvider, } from '../../components/DataContext';
import { PAGE_CONFIG, } from '../../consts/index';
import ArticleBody from '../../components/ArticleBody';
import ArticleHeader from '../../components/ArticleHeader';
import ChartBeatInit from '../../components/ChartbeatInit';
import Jsonld from '../../components/JsonLd';
import LayoutContainer from '../../components/LayoutContainer';
import Masthead from '../../components/Masthead';
import Seo from '../../components/Seo';
import FacebookInit from '../../components/FacebookInit';
import Favicons from '../../components/Favicons';
import GAInit from '../../components/GAInit';
import getStaticPaths from '../../utils/getStaticPaths';
import getStaticProps from '../../utils/getStaticProps';
import { setDataAttributes, } from '../../utils/setDataAttributes';

export default function Page({ data, isClosed, site, } = {}) {
  const readyToRender = isClosed != null && !!data && !!site;
  if (readyToRender) {
    const {
      writers,
      primarySection,
      secondarySection,
      articleId,
      seoData,
    } = data;

    const isPremium = seoData.premiumStatus !== 'none';

    setDataAttributes({
      article_id: articleId,
      blocked: isClosed,
      openmode_back: isPremium ? 0 : 1,
      primary_section: primarySection ? primarySection.name : null,
      secondary_section: secondarySection ? secondarySection.name : null,
      writer_id:
        writers
          .map(writer => writer.contentId)
          .filter(writer => !!writer)
          .join('/') || null,
      writer_name:
        writers
          .map(writer => writer.contentName)
          .filter(writer => !!writer)
          .join(',') || null,
    });

    return (
      <DataProvider value={data}>
        <Favicons site={site} />
        <FacebookInit site={site} />
        <GAInit site={site} />
        <Seo />
        <ChartBeatInit />

        <Masthead />
        <LayoutContainer tagName="article">
          <ArticleHeader />
          <ArticleBody isClosed={isClosed} />
        </LayoutContainer>
        <Jsonld />
      </DataProvider>
    );
  }
  return null;
}

export { getStaticPaths, getStaticProps, PAGE_CONFIG as config, };
