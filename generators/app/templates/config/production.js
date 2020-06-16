const pkg = require('../package.json');

module.exports = {
  pathPrefix: `/static-interactive/pages/${pkg.name}/`,
  useUnaprovedData: false,
};
