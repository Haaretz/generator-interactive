import { useFela, } from 'react-fela';
import React from 'react';

import { useData, } from './DataContext';

import Byline from './Byline';
import ShareBar from './ShareBar';

export default function ArticleHeader() {
  const { css, theme, } = useFela();
  const { mobileSubtitle, mobileTitle, subtitle, title, } = useData('article');

  const titleClassName = css({
    ...theme.type(9),
    extend: [
      theme.mq(
        { from: 'm', },
        {
          ...theme.type(10),
        }
      ),
    ],
  });

  const articleHeaderStyles = css({
    marginBottom: '4rem',
  });

  return (
    <header className={articleHeaderStyles}>
      <h1 className={titleClassName}>
        <Text text={title} mobileText={mobileTitle} />
      </h1>
      <p>
        <Text text={subtitle} mobileText={mobileSubtitle} />
      </p>
      <div className={`article-header-info`}>
        <Byline />
        <ShareBar monochrom="bodyText" />
      </div>
    </header>
  );
}

function Text({ text = null, mobileText, }) {
  const { css, theme, } = useFela();

  const hasMobileText = mobileText && mobileText !== text;
  if (hasMobileText) {
    return (
      <>
        <span
          className={css({
            extend: [ theme.mq({ until: 's', }, { display: 'none', }), ],
          })}
        >
          {text}
        </span>
        <span
          className={css({
            extend: [ theme.mq({ from: 's', }, { display: 'none', }), ],
          })}
        >
          {mobileText}
        </span>
      </>
    );
  }
  return text;
}
