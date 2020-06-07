const path = require('path');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rimraf = require('rimraf');


const kebabCase = require('../../common/kebabCase');
const shouldUseYarn = require('../../common/shouldUseYarn');
const initializeGit = require('../../common/initializeGit');
const createInitialGitCommit = require('../../common/createInitialGitCommit');

// Run loop order:
// 1. initializing
// 2. prompting
// 3. configuring
// 4. default
// 5. writing
// 6. conflicts
// 7. install
// 8. end
module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('elementName', {
      type: String,
      required: false,
      description: 'The name of the element being built',
    });

    this.option('debug', {
      desc: 'Run in debug mode',
      alias: 'd',
      type: Boolean,
      default: false,
    });

    if (this.options.elementName) this.elementName = kebabCase(this.options.elementName);

    this.cwd = this.destinationPath();
  }

  async prompting() {
    // Have Yeoman greet the user.
    this.log(yosay('Let\'s create a new Haaretz interactive project'));

    const prompts = [
      {
        type: 'input',
        name: 'elementName',
        message: 'Your project\'s name:',
        when: !this.options.elementName,
        validate: input => input !== '' || 'A project name is required',
        default: path.basename(this.destinationPath()),
        transformer: kebabCase,
      },
      {
        when: ({ elementName, }) => {
          const cwd = path.basename(this.destinationPath());
          const projectName = this.elementName || elementName;
          return cwd !== projectName;
        },
        type: 'confirm',
        name: 'createDir',
        message: answers => `"${chalk.yellow(
          this.elementName || answers.elementName
        )}" isn't the current working directory...\n  Should I create it initialize the element inside it?\n  Otherwise, I'll just initialize it in the current working directory`,
        default: true,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description (e.g., "A graph showing unemployment rates"):',
      },
      {
        type: 'list',
        name: 'language',
        message: 'What language is your project in?',
        choices: [ 'Hebrew', 'English', ],
        default: 0,
      },
      {
        type: 'list',
        name: 'site',
        message: 'What site is this project for?',
        choices: [ 'haaretz.co.il', 'themarker.com', 'haaretz.com', ],
        default: 0,
        required: true,
      },
      {
        type: 'input',
        name: 'username',
        message: 'GitHub username',
        store: true,
      },
      {
        type: 'checkbox',
        name: 'userdeps',
        message: 'Would you like any of the following installed?\n ',
        choices: [ 'd3', 'ramda', 'lodash', ],
      },
    ];

    // To access answers later use this.answers.someAnswer;
    this.answers = await this.prompt(prompts);
    this.elementName = this.elementName || this.answers.elementName;

    this.composeWith(require.resolve('../element'), {
      // theme: { var: 'value', },
      inApp: true,
      elementName: this.elementName,
      createDir: false,
      username: this.answers.username,
      deps: this.answers.userdeps,
      lang: this.answers.language,
      site: this.answers.site,
    });
  }

  writing() {
    const elementName = this.elementName;
    const { username, description, } = this.answers;
    const langCode = this.answers.language.toLowerCase().slice(0, 2);

    if (this.answers.createDir) {
      this.log(chalk.magenta(`Creating ${elementName}`));
      mkdirp(elementName);

      this.destinationRoot(this.destinationPath(elementName));
    }

    // copy templates:
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(''),
      {
        description,
        elementName,
        langCode,
        site: this.answers.site,
        username,
      }
    );
    this.fs.copyTpl(
      this.templatePath('**'),
      this.destinationPath(''),
      {
        description,
        elementName,
        langCode,
        site: this.answers.site,
        username,
      }
    );
  }

  installPackages() {
    this.isYarnAvailable = shouldUseYarn();
    const install = (
      this.isYarnAvailable
        ? this.yarnInstall
        : this.npmInstall
    ).bind(this);

    // Install devDependencies
    install(
      [
        '@haaretz/fela-utils',
        '@haaretz/htz-css-tools',
        '@haaretz/htz-theme',
        'babel-eslint',
        'babel-jest',
        'concurrently',
        'config',
        'eslint-config-airbnb',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react',
        'fela',
        'fela-dom',
        'next',
        'prettier',
        'react',
        'react-dom',
        'react-fela',
      ],
      { [this.isYarnAvailable ? 'dev' : 'save-dev']: true, }
    );

    // Install project dependencies
    install([
      '@haaretz/vanilla-user-utils',
      'lazysizes',
      'validator',
    ]);
  }

  install() {
    // We need to initialize git before installing dependencies
    // because husky requires the '.git' dir to already exist before it
    // is installed.
    this.gitInitialized = initializeGit(this.templatePath());

    this.installDependencies({
      bower: false,
      npm: !this.isYarnAvailable,
      yarn: this.isYarnAvailable,
    });
  }

  end() {
    this.initialCommitCreated = createInitialGitCommit(this.gitInitialized);

    const elementName = this.elementName;
    const isInSubdir = this.destinationPath() !== this.cwd;

    // Log basic documentation
    this.log('\n\n\n');
    this.log(
      chalk.cyan('* ******************************************************')
    );
    this.log(chalk.cyan('*'));
    if (isInSubdir) {
      this.log(chalk.cyan(`* Project created in "${elementName}" directory`));
    }
    else {
      this.log(chalk.cyan(`* "${elementName}" created in current directory`));
    }

    this.log(
      chalk.cyan('*\n* '),
      chalk.cyan('------------------------------------------------------'),
      chalk.cyan('\n*')
    );
    this.log(
      chalk.cyan('* '),
      'The following development scripts are available:'
    );

    this.log(chalk.cyan('*   '), chalk.red.bold('yarn dev'));
    this.log(chalk.cyan('*     '), 'Start a development server');

    this.log(chalk.cyan('*   '), chalk.red.bold('yarn export'));
    this.log(chalk.cyan('*     '), 'Create a production optimized build and static');
    this.log(chalk.cyan('*     '), 'pages ready for deployment');

    this.log(chalk.cyan('*   '), chalk.red.bold('yarn export:pre'));
    this.log(chalk.cyan('*     '), 'Create a production-optimized build and static');
    this.log(chalk.cyan('*     '), 'page ready for deployment to the staging env');

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn deploy'));
    this.log(chalk.cyan('*     '), 'Deploy the production-optimized build and static pages');
    this.log(
      chalk.cyan('*     '),
      chalk.yellow(`to https://haaretz.co.il/static-interactive/pages/${elementName}`)
    );

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn deploy:pre'));
    this.log(chalk.cyan('*     '), 'Deploy the production-optimized build and static pages');
    this.log(chalk.cyan('*     '), 'for testing purposes in the staging env to');
    this.log(
      chalk.cyan('*     '),
      chalk.yellow(`https://haaretz.co.il/static-interactive/pages-pre/${elementName}`)
    );

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn lint'));
    this.log(chalk.cyan('*     '), 'Lint files');

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn format'));
    this.log(chalk.cyan('*     '), 'Lint files with autofixing');

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn test'));
    this.log(chalk.cyan('*     '), 'Run tests');

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn test:watch'));
    this.log(chalk.cyan('*     '), 'Run tests in watch mode');

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn gc'));
    this.log(chalk.cyan('*     '), 'Create a commit with Commitizen');

    this.log(
      chalk.cyan('*\n* '),
      chalk.cyan('------------------------------------------------------'),
      chalk.cyan('\n*')
    );

    this.log(chalk.cyan('* '), `Theme templates reside in the ${
      chalk.yellow('"theme"')
    } directory.`);
    this.log(
      chalk.cyan('* '),
      `Define your project's theme colors in ${chalk.yellow('"theme/consts/palette.js"')}.`
    );

    this.log(
      chalk.cyan('*\n* '),
      chalk.cyan('------------------------------------------------------'),
      chalk.cyan('\n*')
    );

    this.log(chalk.cyan('* '), 'URLs of the articles that serve as the project\'s');
    this.log(chalk.cyan('* '), 'data sources should be defined in the');
    this.log(chalk.cyan('* '), `${chalk.yellow('PAGES')} const in ${chalk.yellow('"consts/index.js"')}, respectively`);

    this.log(
      chalk.cyan('*\n* '),
      chalk.cyan('------------------------------------------------------'),
      chalk.cyan('\n*')
    );

    this.log(
      chalk.cyan('* '),
      `For the full documentation see ${chalk.yellow('README.md')}`
    );

    this.log(
      chalk.cyan('*\n* '),
      chalk.cyan('------------------------------------------------------'),
      chalk.cyan('\n*')
    );

    if (this.gitInitialized) {
      if (this.initialCommitCreated) {
        this.log(
          chalk.cyan('* '),
          'Initialized a git repository and committed all base files.'
        );
      }
      else {
        this.log(
          chalk.cyan('* '),
          'Initialized a git repository but failed to create initial commit.'
        );
      }
    }
    else {
      this.log(
        chalk.cyan('* '),
        'Project could not be initialized as git repository.'
      );
      this.log(
        chalk.cyan('* '),
        `Please initiate it manualy and run ${
          this.isYarnAvailable ? '"yarn"' : '"npm install"'
        } to install git hooks.`
      );
    }

    if (isInSubdir) {
      this.log(
        chalk.cyan('* '),
        `${chalk.yellow(`cd ${this.elementName}`)} to start working`
      );
    }

    this.log(
      chalk.cyan(
        '*\n* ******************************************************\n\n'
      )
    );

    // remove yo-related files
    [ '.yo-repository', '.yo-rc.json', ]
      .forEach(filename => {
        const filePath = path.join(this.cwd, filename);
        rimraf.sync(filePath);
      });
  }
};
