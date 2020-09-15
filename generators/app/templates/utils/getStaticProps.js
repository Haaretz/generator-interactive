/* global fetch */
import chalk from 'chalk';
import config from 'config';

import { PAGES_URL_PARTS, } from '../consts/index';
import processArticleBody from './processArticleBody';

export default async function getStaticProps({ params, }) {
  const { id, filename, } = params;
  const urlParts = PAGES_URL_PARTS.find(item => item.id === id);

  if (!urlParts) {
    throw new Error(
      chalk.red(`There is no page defined for contentId ${id}.\n`)
        + chalk.red('Your url either has a typo or you forgot to define it\n')
        + chalk.red(
          `in the ${chalk.bold('PAGES const')} at ${chalk.bold(
            'consts/index.js'
          )}`
        )
    );
  }

  const { papiurl, domain, } = urlParts;

  const props = await parseData(papiurl, filename, domain, id);

  return { props, };
}

async function parseData(url, filename, domain, id) {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan(`Fetching data for ${chalk.bold(id)}`));

  try {
    const json = await getPapiJson(url, id);
    const { lineage, jsonld, seoData, slots, sectionContentIds, } = json;
    const articleSlotFromJson = slots.article;
    const sectionName = articleSlotFromJson.find(
      ({ inputTemplate, }) => inputTemplate === 'com.tm.PageTitle'
    );
    const articleDataFromJson = articleSlotFromJson.find(({ inputTemplate, }) => [
      'com.tm.StandardArticle',
      'com.htz.StandardArticle',
      'com.hdc.StandardArticle',
    ].includes(inputTemplate));

    const commentsContentId = articleDataFromJson.commentsElementId;

    // html AST to string
    const body = articleDataFromJson.body.map(processArticleBody);
    articleDataFromJson.body = body;

    const recommendedArticles = slots.postMain?.find(
      ({ inputTemplate, view, }) => (inputTemplate === 'com.tm.element.List' && view === 'Bender')
    ) || null;

    const isClosed = filename.includes('closed');
    const site = domain.toLowerCase();
    const sections = lineage.slice(1, -1);
    const [ primarySection = null, secondarySection = null, ] = sections
      .slice(-2)
      .reverse();
    const writers = articleDataFromJson.authors;

    const data = {
      article: articleDataFromJson,
      articleId: id,
      commentsContentId,
      isClosed,
      jsonld,
      lineage,
      primarySection,
      recommendedArticles,
      secondarySection,
      section: sectionName,
      sectionContentIds,
      seoData,
      site,
      writers,
    };

    return {
      isClosed,
      site,
      data,
    };
  }
  catch (error) {
    return Promise.reject(error);
  }
}

async function getPapiJson(url, id) {
  const GET_CONTENT_IDS_URL
    = 'https://editor.haaretz.co.il/generalActionsServlet?data&action=getParentIds&contentId=';
  const contentIdsResponse = await fetch(GET_CONTENT_IDS_URL + id);

  if (!contentIdsResponse.ok) {
    const error = new Error(contentIdsResponse.statusText);
    error.response = contentIdsResponse;
    throw error;
  }

  const contentIds = await contentIdsResponse.json();
  let json;

  if (config.get('useUnaprovedData')) {
    const papiPreviewUrl = `https://editor.haaretz.co.il/preview/papi/${contentIds.join(
      '/'
    )}?contentIdsInEdit=${
      contentIds[contentIds.length - 1]
    }&data&exploded=true`;

    const previewResponse = await fetch(papiPreviewUrl, {
      method: 'GET',
      headers: {
        Cookie:
          'userId=98; path=/; domain=editors.haaretz.co.il; Expires=Tue, 19 Jan 2038 03:14:07 GMT;',
      },
    });

    if (!previewResponse.ok) {
      const error = new Error(previewResponse.statusText);
      error.response = previewResponse;
      throw error;
    }

    json = await previewResponse.json();
  }
  else {
    const response = await fetch(`${url}?exploded=true`);

    if (response.ok) json = await response.json();
    else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
  json.sectionContentIds = contentIds.slice(0, -1);
  return json;
}
