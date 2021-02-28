import * as React from 'react';
import { useFela, } from 'react-fela';

export default function Credits( { data } ) {
  const { css, theme } = useFela();

  const creditsStyles = css({
    display: 'flex',
    flexDirection: 'column',
    marginTop: '12rem',
    alignItems: 'center',
    ...theme.type(-1, {lines: 4}),
    
    // ...theme.mq({from: 'l'}, {
    //   margin: '18rem 0 4rem',
    // }),
    
    ...theme.mq({from: 'l'}, {
      margin: '18rem 0 4rem',
    }),
  })

  return (
    <section className={creditsStyles}>
      {
        data.map((node, i) => {
          return (
            <span key={`credit-${i}`}>
              <strong>{node.name}</strong>: {node.credit}
            </span>
          )
        })
      }
    </section>
  );
}
