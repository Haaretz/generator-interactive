const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const rimraf = require('rimraf');

const shouldUseYarn = require('../../common/shouldUseYarn');
const lsMinR = require('../../common/lsMinR');
const initializeGit = require('../../common/initializeGit');
const createInitialGitCommit = require('../../common/createInitialGitCommit');
const kebabCase = require('../../common/kebabCase');
const prompts = require('../../common/prompts');

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

    this.option('inApp', {
      desc: 'Used internally to disable features unneeded in an app',
      type: Boolean,
      default: false,
      hide: true,
      required: false,
    });

    this.option('elementName', {
      desc: 'The name of the element or page being built',
      type: String,
      required: false,
      hide: true,
    });
    this.option('createDir', {
      desc: 'Create a new directory and initialize inside it',
      type: Boolean,
      required: false,
      hide: true,
    });
    this.option('lang', {
      desc: 'Project language (one of Hebrew or English)',
      type: val => {
        if ([ 'hebrew', 'english', ].includes(val.toLowerCase())) return val;
        throw new RangeError('The "lang" option may only be "Hebrew" or "English"');
      },
      required: false,
      hide: true,
    });
    this.option('username', {
      desc: 'Create a new directory and initialize inside it',
      type: String,
      required: false,
      hide: true,
    });
    this.option('deps', {
      desc: 'Create a new directory and initialize inside it',
      type: val => val && val.split && val.split(',').filter(x => !!x),
      required: false,
      hide: true,
    });
    this.option('theme', {
      desc: 'js object to share as sass variables',
      type: val => JSON.parse(val),
      required: false,
      hide: true,
    });

    if (this.options.elementName) this.elementName = kebabCase(this.options.elementName);

    this.cwd = this.destinationPath();
  }

  async prompting() {
    // Have Yeoman greet the user.
    if (this.options.inApp) {
      this.answers = {
        createDir: this.options.createDir,
        username: this.options.username,
        userdeps: this.options.deps,
        language: this.options.lang,
      };
    }
    else {
      this.log(yosay('Let\'s create a new Haaretz interactive element'));
      const boundPrompts = prompts.bind(this);

      this.answers = await this.prompt(boundPrompts());
    }
    this.elementName = this.elementName || this.answers.elementName;
  }

  writing() {
    const elementName = this.elementName;
    const classPrefix = elementName;
    const { username, description, } = this.answers;
    const langCode = this.answers.language.toLowerCase().slice(0, 2);
    const direction = langCode === 'he' ? 'rtl' : 'ltr';
    const remotePath = `/static-interactive/elements/${elementName}/`;
    const remotePathPre = `/static-interactive/elements-pre/${elementName}/`;
    this.remotePath = remotePath;
    this.remotePathPre = remotePathPre;

    if (this.answers.createDir && !this.options.inApp) {
      this.log(chalk.magenta(`Creating ${elementName}`));
      mkdirp(elementName);
      this.destinationRoot(this.destinationPath(elementName));
    }

    // copy files that do not require changing:
    this.fs.copy(
      this.templatePath('commitlint.config.js'),
      this.destinationPath('commitlint.config.js')
    );
    this.fs.copy(
      this.templatePath(
        path.join(
          '..',
          '..',
          '..',
          'common',
          'deploy.js'
        )
      ),
      this.destinationPath(path.join('scripts', 'deploy.js'))
    );
    this.fs.copy(
      this.templatePath('public/**'),
      this.destinationPath('public/')
    );
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

    // copy templates:
    this.fs.copyTpl(
      this.templatePath('rollup.config.js'),
      this.destinationPath('rollup.config.js'),
      {
        inApp: this.options.inApp,
        lang: this.answers.language,
        theme: this.options.theme || {},
      }
    );

    if (this.options.inApp) {
      this.fs.copy(this.templatePath('.editorconfig'), this.destinationPath());
      this.fs.copy(this.templatePath('.npmignore'), this.destinationPath());
    }
    else {
      this.fs.copy(this.templatePath('.*'), this.destinationPath());
      this.fs.copyTpl(
        this.templatePath('templates/**'),
        this.destinationPath('templates/'),
        { langCode, direction, },
        { delimiter: '$', }
      );
      this.fs.copyTpl(
        this.templatePath('scripts/**'),
        this.destinationPath('scripts/'),
        { remotePath, remotePathPre, elementName, classPrefix, },
        { delimiter: '$', }
      );
      this.fs.copyTpl(this.templatePath('src/**'), this.destinationPath('src/'), {
        classPrefix,
        elementName,
      });
      this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        {
          username,
          description,
          remotePath,
          remotePathPre,
          elementName,
        }
      );
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath('README.md'),
        { description, remotePath, remotePathPre, elementName, }
      );
    }
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
        '@babel/core',
        '@babel/preset-env',
        '@commitlint/cli',
        '@commitlint/config-conventional',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-node-resolve',
        '@rollup/plugin-replace',
        'chalk',
        'commitizen',
        'cross-spawn',
        'cross-env',
        'cz-conventional-changelog',
        'doctoc',
        'edit-json-file',
        'eslint',
        'eslint-plugin-import',
        'eslint-plugin-jest',
        'fs-extra',
        'git-remote-origin-url',
        'git-state',
        'glob',
        'husky',
        'isomorphic-unfetch',
        'jenkins-log-stream',
        'jest',
        'lint-staged',
        'lodash.template',
        'npm-run-all',
        'prompts',
        'rollup',
        'rollup-plugin-babel',
        'rollup-plugin-delete',
        'rollup-plugin-terser',
      ],
      { [this.isYarnAvailable ? 'dev' : 'save-dev']: true, }
    );
    // Element-only dependencies
    if (!this.options.inApp) {
      install(
        [
          'eslint-config-airbnb-base',
          'live-server',
          '@haaretz/sass-selectors',
          '@haaretz/sass-type',
          'autoprefixer',
          'cssnano',
          'jigsass-tools-maps',
          'jigsass-tools-mq',
          'json-sass',
          'node-sass',
          'postcss-logical',
          'rollup-plugin-postcss',
        ],
        { [this.isYarnAvailable ? 'dev' : 'save-dev']: true, }
      );
    }

    // Install project dependencies
    install([
      'core-js',
      'dynamic-import-polyfill',
      'regenerator-runtime',
    ]);

    // Install user-selected dependencies
    if ((this.answers.userdeps || []).length > 0) install(this.answers.userdeps);
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

    if (this.options.debug) {
      if (this.options.inApp) {
        this.log(chalk.yellow('\nIn Element Generator'));
      }
      this.log(chalk.red(`${this.options.inApp ? '' : '\n'}Copying dotfiles`));
      fs.readdirSync(this.templatePath())
        .filter(filename => filename.startsWith('.'))
        .forEach(filename => {
          this.log(filename);
        });
      this.log('gitignore -> .gitignore');
      this.log(chalk.red('\nCopying from "public/"'));
      lsMinR('public').forEach(filename => this.log(filename));
      this.log(chalk.red('\nCopying from "templates/"'));
      lsMinR('templates').forEach(filename => this.log(filename));
      this.log(chalk.red('\nCopying from "scripts"'));
      lsMinR('scripts').forEach(filename => this.log(filename));
    }

    if (!this.options.inApp) {
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
      this.log(chalk.cyan('*     '), 'Start a development server on port 5000');
      this.log(
        chalk.cyan('*     '),
        `Change port with the ${chalk.bold('PORT')} variable: ${chalk.yellow(
          'PORT=6060 yarn dev'
        )}`
      );

      this.log(chalk.cyan('* '));
      this.log(chalk.cyan('*   '), chalk.red.bold('yarn deploy'));
      this.log(
        chalk.cyan('*     '),
        'Create a production-optimized build and deploy to:'
      );
      this.log(
        chalk.cyan('*     '),
        chalk.yellow(`https://haaretz.co.il/${this.remotePath}`)
      );

      this.log(chalk.cyan('* '));
      this.log(chalk.cyan('*   '), chalk.red.bold('yarn deploy:pre'));
      this.log(
        chalk.cyan('*     '),
        'Create a production-optimized build for testing purposes and deploy to:'
      );
      this.log(
        chalk.cyan('*     '),
        chalk.yellow(`https://haaretz.co.il/${this.remotePathPre}`)
      );

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

      this.log(chalk.cyan('* '), 'HTML templates for elements reside in the');
      this.log(
        chalk.cyan('* '),
        `${chalk.yellow('"templates/partials/"')} directory. Create a single file`
      );
      this.log(chalk.cyan('* '), 'for each separate element');
      this.log(chalk.cyan('* '));
      this.log(
        chalk.cyan('* '),
        'All element partials will automatically be included'
      );
      this.log(
        chalk.cyan('* '),
        `in the generated ${chalk.yellow('"index.html"')} file.`
      );
      this.log(chalk.cyan('* '));
      this.log(
        chalk.cyan('* '),
        `To change the output of ${chalk.yellow('"index.html"')}, edit`
      );
      this.log(chalk.cyan('* '), chalk.yellow('"templates/pages/index.html"'));

      this.log(
        chalk.cyan('*\n* '),
        chalk.cyan('------------------------------------------------------'),
        chalk.cyan('\n*')
      );

      this.log(chalk.cyan('* '), 'JavaScript and SCSS source files reside in');
      this.log(
        chalk.cyan('* '),
        `${chalk.yellow('src')} and ${chalk.yellow('src/style')}, respectively`
      );

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
  }
};
