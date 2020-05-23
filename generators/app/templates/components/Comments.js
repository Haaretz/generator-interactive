import { useFela, } from 'react-fela';
import * as React from 'react';

import { useData, } from './DataContext';
import H from './H';
import Section from './Section';

const i18n = {
  heb: {
    sectionHead: 'תגובות',
  },
  eng: {
    sectionHead: 'Comments',
  },
};

export default function Comments() {
  const { css, theme, } = useFela();
  const commentsContentId = useData('commentsContentId');
  const site = useData('site');

  const lang = site === 'haaretz.com' ? 'eng' : 'heb';
  const texts = i18n[lang];

  const sectionHeadClasses = css({
    // Section head styles here
  });
  const nameInputClasses = css({
    // name input styles here
  });

  return (
    <Section id="comments" data-content-id={commentsContentId}>
      <H className={sectionHeadClasses}>{texts.sectionHead}</H>
      <form>
        <label htmlFor="commentsForm__name">
          <input
            id="commentsForm__name"
            className={nameInputClasses}
            type="text"
            requried
          />
        </label>
      </form>
    </Section>
  );
}
