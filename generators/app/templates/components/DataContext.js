import React from 'react';

export const DataContext = React.createContext();
DataContext.displayName = 'DataContext';

export const DataProvider = DataContext.Provider;
export const DataConsumer = DataContext.Consumer;

export function useData(...path) {
  const data = React.useContext(DataContext);
  if (path.length) {
    const dataAtPath = path.reduce((result, key) => result[key], data);
    if (dataAtPath == null) {
      /* eslint-disable no-console */
      console.error(`[${path.join('][')}] doesn't exist in page data`);
      console.trace();
      /* eslint-enable no-console */

      return undefined;
    }
    return dataAtPath;
  }
  return data;
}
