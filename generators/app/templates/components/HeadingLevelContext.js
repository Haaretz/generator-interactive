import React, { useContext, } from 'react';

const HeadingLevelContext = React.createContext(1);

export const HeadingLevelProvider = HeadingLevelContext.Provider;

export function useHeadingLevel({ offset = 0, isH1 = false, } = {}) {
  const contextualHeadingLevel = useContext(HeadingLevelContext);
  const headingLevel = isH1
    ? 1
    : Math.max(
      Math.min(Math.round(contextualHeadingLevel + offset), 6),
      2
    );

  return headingLevel;
}
