import React from 'react';
import { useFela, } from 'react-fela';
import { parseStyleProps, } from '@haaretz/htz-css-tools';
import { useData, } from './DataContext';
import Section from './Section';
import H from './H';
import { Picture, } from './Image';

const sectionStyles = ({ theme, miscStyles, }) => ({
  backgroundColor: theme.color('listBg'),
  padding: '0 2rem 2rem',
  display: 'grid',
  gridRowGap: '1rem',
  gridColumnGap: '4rem',
  marginTop: '8rem',

  extend: [
    theme.mq(
      { from: 'xl', },
      {
        gridTemplateColumns: 'repeat(6, 1fr)',
      }
    ),
    theme.mq(
      { from: 'l', until: 'xl', },
      {
        gridTemplateColumns: 'repeat(4, 1fr)',
      }
    ),
    theme.mq(
      { from: 's', until: 'l', },
      {
        gridTemplateColumns: 'repeat(3, 1fr)',
      }
    ),
    ...(miscStyles ? parseStyleProps(miscStyles, theme.mq, theme.type) : []),
  ],
});

const listHeaderStyles = ({ theme, }) => ({
  gridColumn: '1/-1',
  marginInlineStart: '-2rem',
  marginInlineEnd: '-2rem',
  backgroundColor: theme.color('listBg'),
  color: theme.color('listHeader'),
  borderTop: '2px solid currentColor',
  paddingTop: 'calc(1rem - 2px)',
  paddingInlineStart: '2rem',
  paddingInlineEnd: '2rem',
  paddingBottom: '1rem',
  ...theme.type(2),
  extend: [
    theme.mq(
      { until: 's', },
      {
        position: 'sticky',
        top: '0',
        zIndex: 2,
      }
    ),
  ],
});

function RecommendedArticles({ miscStyles, }) {
  const { css, } = useFela({ miscStyles, });
  const data = useData('recommendedArticles');

  if (!data) return null;

  const { title, items, } = data;

  const sectionClasses = css(sectionStyles);
  const headerClasses = css(listHeaderStyles);

  return (
    <section className={sectionClasses}>
      <header className={headerClasses}>
        <H>{title}</H>
      </header>
      <Section as={React.Fragment}>
        {items.slice(0, 6).map((item, index) => (
          <Teaser key={item.contentId} index={index} data={item} />
        ))}
      </Section>
    </section>
  );
}

const TeaserPictureOptions = [
  {
    aspect: 'headline',
    sizes: 'calc(100vw - 24px)',
    widths: [ 600, 390, 350, ],
  },
  {
    from: 's',
    aspect: 'vertical',
    sizes: [
      { from: 'xl', size: `calc((100vw - ${28 * 6}px) / 6)`, },
      { from: 'l', size: `calc((100vw - ${24 * 4}px) / 4)`, },
      { size: `calc((100vw - ${24 * 3}px) / 3)`, },
    ],
    widths: [ 500, 312, 212, ],
  },
];

const contentAnchorStyles = {
  ':after': {
    content: '""',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    zIndex: 0,
  },
};

function Teaser({ data, index, }) {
  const { css, theme, } = useFela();
  const { image, title, titleMobile, authors, path, } = data;

  const displayNoneUntil = index > 3 ? 'xl' : index > 2 ? 'l' : null;

  const articleClasses = css({
    position: 'relative',
    display: 'grid',
    color: theme.color('listContent'),
    gridGap: '1rem',
    gridTemplateRows: 'auto 1fr auto',
    extend: [
      ...(displayNoneUntil
        ? [ theme.mq({ until: displayNoneUntil, }, { display: 'none', }), ]
        : []),
    ],
  });

  const footerClasses = css({
    color: theme.color('listContent', '-1'),
    fontWeight: 700,
    ...theme.type(-2),
  });

  return (
    <article className={articleClasses}>
      <a href={path} className={css({ position: 'relative', zIndex: 1, })}>
        <Picture data={image} options={TeaserPictureOptions} isLazyload />
      </a>
      <a href={path} className={css(contentAnchorStyles)}>
        <H>
          <span
            className={css({
              ...theme.mq({ until: 's', }, { display: 'none', }),
            })}
          >
            {title}
          </span>
          <span
            className={css({
              ...theme.mq({ from: 's', }, { display: 'none', }),
            })}
          >
            {titleMobile}
          </span>
        </H>
      </a>
      <footer className={footerClasses}>
        {authors
          && authors
            .slice(0, 2)
            .map(({ contentName, contentId, }, i, { length, }) => (
              <address key={contentId || `${contentName}-${i}`}>
                {contentName}
                {i < length - 1 ? ', ' : ''}
              </address>
            ))}
      </footer>
    </article>
  );
}

export default RecommendedArticles;
