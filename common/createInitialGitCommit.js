const { execSync, } = require('child_process');

module.exports = function createInitialGitCommit(isGitInitialized) {
  if (isGitInitialized) {
    try {
      execSync('git add -A', { stdio: 'ignore', });
      execSync(
        'git commit -m "chore:Initial commit from generator" --no-verify',
        { stdio: 'ignore', }
      );
      return true;
    }
    // eslint-disable-next-line
    catch (_) {
      return false;
    }
  }

  return false;
};
