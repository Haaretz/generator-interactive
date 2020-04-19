/* eslint import/no-extraneous-dependencies: [ "error", { "devDependencies": true } ] */
import path from 'path';
import fs from 'fs';

import chalk from 'chalk';
import fse from 'fs-extra';
import template from 'lodash.template';

const PARTIALS_PATH = path.join(process.cwd(), 'templates', 'partials');
const TEMPLATES_PATH = path.join(process.cwd(), 'templates', 'pages');

export default function createHtml({
  module: moduleFile,
  nomodule: nomoduleFile,
  css: cssFile,
}) {
  const pathPrefix
    = process.env.IS_PRE === 'true'
      ? '/st<$= remotePath $>'
      : process.env.NODE_ENV === 'production'
        ? '/st<$= remotePathPre $>'
        : './';

  const templateVars = {
    cssFile,
    moduleFile,
    nomoduleFile,
    pathPrefix,
    classPrefix: <$= classPrefix $>,
  };

  const partials = fs.readdirSync(PARTIALS_PATH).map(partialPath => {
    const partial = fs.readFileSync(path.join(PARTIALS_PATH, partialPath), { encoding: 'utf-8', });
    const compiledPartial = template(partial);
    const processedPartial = compiledPartial(templateVars);
    writeFile(outputPath(partialPath), processedPartial);
    return processedPartial;
  });

  fs.readdirSync(TEMPLATES_PATH).forEach(pagePath => {
    const page = fs.readFileSync(path.join(TEMPLATES_PATH, pagePath), { encoding: 'utf-8', });

    const compiledTemplate = template(page);
    const processedContent = compiledTemplate({
      ...templateVars,
      partials,
    });
    writeFile(outputPath(pagePath), processedContent);
  });
}

function writeFile(outputPath, content) {
  console.log(`Writing ${chalk.cyan(outputPath)}...`);
  fse.outputFileSync(outputPath, content);
}

function outputPath(filename) {
  return path.join(
    process.cwd(),
    'public',
    path.basename(filename)
  );
}
