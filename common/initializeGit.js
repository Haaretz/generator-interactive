const { execSync, } = require('child_process');
const path = require('path');
const rimraf = require('rimraf');

module.exports = function initializeGit(root) {
  let didInit = false;
  try {
    if (isAlreadyGitRepository()) return false;
    execSync('git --version', { stdio: 'ignore', });

    execSync('git init', { stdio: 'ignore', });
    didInit = true;
    return true;
  }
  catch (err) {
    if (didInit) {
      try {
        rimraf.sync(path.join(root, '.git'));
      }
      // eslint-disable-next-line
      catch (_) {}
    }
    return false;
  }
};

function isAlreadyGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore', });
    return true;
  }
  // eslint-disable-next-line
  catch (err) {}
  return false;
}
