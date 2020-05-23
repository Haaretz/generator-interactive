import React from 'react';

import { useData, } from './DataContext';

export default function Jsonld() {
  const jsonld = useData('jsonld');

  /* eslint-disable react/no-danger */
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonld, }}
    />
  );
  /* eslint-enable react/no-danger */
}
