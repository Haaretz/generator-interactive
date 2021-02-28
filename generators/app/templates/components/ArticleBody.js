import { useFela, } from 'react-fela';
import * as React from 'react';

import { useData, } from './DataContext';
import ArticleImage from './ArticleImage';
import LayoutContainer from './LayoutContainer';
// import PromotionBanner from './PromotionBanner';
import PullQuote from './PullQuote';
import Section from './Section';

export default function ArticleBody({ isClosed, }) {
  const { theme, } = useFela();
  const bodyData = useData('article', 'body');
  const focusActiveStyles = {
    color: theme.color('link', 'base'),
    borderBottomColor: theme.color('link', 'base'),
  };

  const sectionStyles = {
    margin: '6rem auto 0',
    position: 'relative',

    '&>*+*': {
      marginTop: '3rem',
    },
    '&>h2+*': {
      marginTop: '1rem',
    },

    '& a': {
      borderBottomColor: theme.color('link', 'base'),
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      transitionProperty: 'all',

      ':hover': {
        ...focusActiveStyles,
        borderBottomColor: 'transparent',
      },
      ':focus': focusActiveStyles,
      ':active': focusActiveStyles,
      ':visited': { color: theme.color('bodyText'), },
      ':hover:visited': { color: theme.color('link', 'base'), },
      extend: [theme.getTransition(0, 'swiftOut'),],
    },

    '& strong': { fontWeight: '700', },
    '& em': { fontStyle: 'italic', },
    '& u': { textDecoration: 'underline', },
    '&>p': {
      extend: [theme.type(1, { lines: 5, }),],
    },
    '&>h2': {
      marginTop: '4rem',

      extend: [theme.type(2),],
    },
    '& mark': {
      backgroundColor: theme.color('bodyTextHighlight'),
    },

    extend: [
      theme.mq(
        { from: 's', until: 'm', },
        {
          maxWidth: '100rem',
        }
      ),
      theme.mq(
        { from: 'm', until: 'l', },
        {
          maxWidth: '126rem',
          padding: '0 16rem',
        }
      ),
      theme.mq(
        { from: 'l', until: 'xl', },
        {
          maxWidth: '163rem',
          padding: '0 32rem 0 32rem',
        }
      ),
      theme.mq(
        { from: 'xl', },
        {
          maxWidth: '176rem',
          padding: '0 45rem',
        }
      ),
    ],
  };

  return (
    <LayoutContainer
      extraStyles={sectionStyles}
      tagName="section"
      attrs={{
        id: 'articleBodyWrapper',
      }}
    >
      <Section as={React.Fragment}>
        {renderData(bodyData || [], isClosed)}
      </Section>
    </LayoutContainer>
  );
}

function renderData(data, isClosed) {

  const elements = data
    .map(node => {

      // Duplicator renders

      // if (node.kind === 'DUPLICATOR_NAME') {
      //   return (
      //     <h1>INSERT COMPONENT HERE</h1>
      //   );
      // }

      // if (node.kind === 'credits') {
      //   return (
      //     <Credits key="credits" data={node.data} />
      //   );
      // }

      if (node.kind === 'htmlString') {
        const Tag = node.tag;
        return (
          <Tag
            key={node.content}
            {...node.attrs}
            dangerouslySetInnerHTML={{ __html: node.content, }}
          />
        );
      }

      if (node.kind === 'image') {
        return (
          <ArticleImage
            key={node.contentName}
            data={node}
            sizes={[
              { from: 'xl', size: '1022px', },
              { from: 'l', size: '834px', },
              { from: 'm', size: '564px', },
              { from: 's', size: '574px', },
              { size: '100vw', },
            ]}
            widths={[320, 420, 580, 840, 1022,]}
            isLazyload
          />
        );
      }

      if (node.inputTemplate === 'com.htz.MagazineArticleQuote') {
        return (
          <PullQuote key={node.contentId || node.contentName}>
            {node.text}
          </PullQuote>
        );
      }

      // Add more types of elements here, as needed

      return null;
    })
    .filter(element => element != null);

  if (isClosed) {
    // Handle what happens in closed articles here

    elements.length = 1;
    // elements.push(<PromotionBanner />);
  }

  return elements;
}
