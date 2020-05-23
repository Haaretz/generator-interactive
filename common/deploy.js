#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const os = require('os');
const readline = require('readline');
const prompts = require('prompts');
const fetch = require('isomorphic-unfetch');
const editJsonFile = require('edit-json-file');
const getOrigin = require('git-remote-origin-url');
const {
  branchSync,
  untrackedSync,
  dirtySync,
  aheadSync,
} = require('git-state');
const JenkinsStreamLogger = require('jenkins-log-stream');

const homedir = os.homedir();
const configsDir = path.join(homedir, '.config');
const confFile = path.join(configsDir, '.htzCredentials.json');

const JENKINS_SERVER = 'jenkins.themarker.com';
const JENKINS_JOB = 'interactive-static-projects';
const BASE_JENKINS_URL = `https://${JENKINS_SERVER}/job/${JENKINS_JOB}/buildWithParameters?token=c04e1cf43a933873a8e40761d56583a0`;

async function deploy() {
  const [ /* executor */, /* script */, projectType, ...args ] = process.argv;
  if (!projectType || !([ 'elements', 'pages', ].includes(projectType))) {
    throw new Error(chalk.red('You must specify your project type ("elements" || "pages")'));
  }

  const profileIndex = args.indexOf('--profile');
  const profile = profileIndex > -1 ? args[profileIndex + 1] : undefined;
  const targetIndex = args.indexOf('--target');
  const target = targetIndex > -1 ? args[targetIndex + 1] : undefined;
  const { user, pass, } = await getUserAndPassword();

  const shouldDeploy = await checkDeployReadiness();
  if (!shouldDeploy) process.exit(1);

  const repoName = await getRepoName();
  const currentBranch = getCurrentBranch();

  const REPO = `&REPO=${repoName}`;
  const TARGET = `&TARGET=${target || repoName}`;
  const BRANCH = `&BRANCH=${currentBranch}`;
  const TYPE = `&TYPE=${projectType}`;
  const PROFILE = profile ? `&PROFILE=${profile}` : '';
  const CAUSE = (`&cause=Initiated from cli by ${user}`).split(' ').join('+');
  const jenkinsDeployUrl = BASE_JENKINS_URL + REPO + TARGET + BRANCH + TYPE + PROFILE + CAUSE;

  const jenkinsAuth = `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
  const buildResponse = await fetch(jenkinsDeployUrl, {
    headers: { Authorization: jenkinsAuth, },
  });
  if (!buildResponse.ok) throw new Error(`Could not initiate build: ${buildResponse.status}`);

  const queueUrl = `${buildResponse.headers.get('location')}api/json`;

  const { buildNumber, } = await fetchQueue(queueUrl, jenkinsAuth);

  const jenkinsLogStream = new JenkinsStreamLogger({
    baseUrl: `https://${user}:${pass}@${JENKINS_SERVER}`,
    job: JENKINS_JOB,
    build: buildNumber,
  });

  jenkinsLogStream.pipe(process.stdout);
}

deploy()
  .catch(err => {
    /* eslint-disable no-console */
    console.error(chalk.red.bold(err.message));
    console.error(err.stack);
    /* eslint-enable no-console */
    process.exitCode = 1;
  });

async function getRepoName() {
  const origin = await getOrigin(process.cwd());

  if (!origin) throw new Error('Your project dos\'nt seem to have an "origin" remote');

  const [ orgOrUser, repoName, ] = origin.match(/^.*?github.*?:(.*?)\/(.*?)(?:\.git)/)
    .slice(1)
    .map(x => x.toLowerCase());

  if (orgOrUser !== 'haaretz') {
    throw new Error(
      'Your project\'s remote origin isn\'t part of the GitHub Haaretz organization'
    );
  }

  return repoName;
}

function getCurrentBranch() {
  const currentBranchName = branchSync(process.cwd());

  if (!currentBranchName) {
    throw new Error('Cannot depoly. Your project doesn\'t seem to be git initialized');
  }

  return currentBranchName;
}

async function getUserAndPassword() {
  let user;
  let pass;

  // Create config dir and file if they don't exist
  if (!fs.existsSync(configsDir)) fs.mkdirSync(configsDir);
  if (!fs.existsSync(confFile)) fs.closeSync(fs.openSync(confFile, 'a'));

  const conf = editJsonFile(confFile, { autosave: true, });
  user = conf.get('jenkins.username');
  pass = conf.get('jenkins.password');

  if (!user) {
    const answers = await prompts({
      type: 'text',
      name: 'username',
      message: 'Jenkins username',
      validate: input => (!!input || chalk.red('A username is required')),
    });
    user = answers.username;
    conf.set('jenkins.username', user);
  }
  if (!pass) {
    const answers = await prompts({
      type: 'password',
      name: 'password',
      message: 'Jenkins password',
      validate: input => (!!input || chalk.red('A password is required')),
    });
    pass = answers.password;
    conf.set('jenkins.password', pass);
  }

  return { user, pass, };
}

async function checkDeployReadiness() {
  const hasUncommittedChanges = !!untrackedSync() || !!dirtySync();
  const aheadOfRemote = aheadSync();
  if (hasUncommittedChanges) {
    const answers = await prompts({
      type: 'confirm',
      name: 'shouldDeploy',
      message: 'You have uncommitted changes which will not be deployed.\n'
      + 'Are you sure you want to continue?',
      initial: false,
    });

    if (!answers.shouldDeploy) return false;
  }
  if (aheadOfRemote > 0 || Number.isNaN(aheadOfRemote)) {
    const answers = await prompts({
      type: 'confirm',
      name: 'shouldDeploy',
      message: 'Your are ahead of remote. Unpushed changes will not be deployed.\n'
      + 'Are you sure you want to continue?',
      initial: false,
    });

    if (!answers.shouldDeploy) return false;
  }
  return true;
}

async function fetchQueue(queueUrl, credentials, allowedRetries = 120) {
  async function getData() {
    return new Promise(resolve => {
      setTimeout(async () => {
        const response = await fetch(queueUrl, { headers: { Authorization: credentials, }, });
        const { ok, } = response;

        if (!ok) resolve({ retry: true, });
        const json = await response.json();
        const { executable, } = json;
        if (json.executable) resolve({ buildUrl: executable.url, buildNumber: executable.number, });
        resolve({ retry: true, });
      }, 500);
    });
  }
  const clearSpinner = spinner(100);

  let iteration = 0;
  while (iteration < allowedRetries) {
    iteration += 1;
    // eslint-disable-next-line no-await-in-loop
    const data = await getData();
    if (data.buildUrl) {
      clearSpinner();
      return data;
    }
  }

  clearSpinner();
  console.error(
    chalk.red('could not locate build in Jenkins.\nPlease check manually at:\n')
    + chalk.cyan('https://jenkins.themarker.com/view/interactive/job/interactive-static-projects/')
  );
  return process.exit(1);
}

function spinner(delay = 100) {
  let counter = 0;
  const frames = [ '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏', ];
  const intervalId = setInterval(() => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    const text = chalk.yellow(
      `${frames[counter % frames.length]} Waiting for build to start`
    );

    counter += 1;

    process.stdout.write(text);
  }, delay);

  return function clearSpinner() {
    clearInterval(intervalId);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  };
}
