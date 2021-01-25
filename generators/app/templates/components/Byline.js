import * as React from 'react';
import { useFela, } from 'react-fela';

import { useData, } from './DataContext';

export default function Byline({
  as = 'span',
  wrapperStyles = null,
  addressStyles = null,
}) {
  const writers = useData('writers');
  const { css, } = useFela();
  const Wrapper = as;

  const wrapperClasses = wrapperStyles && css(wrapperStyles);
  const addressClasses = addressStyles && css(addressStyles);

  return (
    <Wrapper className={wrapperClasses}>
      {writers.map((writer, i) => {
        const isLast = i === writers.length - 1;;

        return (
          <React.Fragment key={writer.contentName}>
            {i > 0 ? (isLast ? ' ו' : ', ') : ''}
            <address className={addressClasses}>
              {writer.url ? (
                <a href={writer.url}>{writer.contentName}</a>
              ) : (
                writer.contentName
              )}
            </address>
          </React.Fragment>
        );
      })}
    </Wrapper>
  );
}
