/* eslint import/no-extraneous-dependencies: [ "error", { "devDependencies": true } ] */
const glob = require('glob');

module.exports = function lsMinR(root) {
  return glob.sync(`${root}/**/*`);
};
