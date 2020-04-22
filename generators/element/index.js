const path = require('path');
const fs = require('fs');
const { execSync, } = require('child_process');
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { camelCase, } = require('camel-case');
const rimraf = require('rimraf');
const commandExistsSync = require('command-exists').sync;

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
    this.log(yosay('Let\'s create a new Haaretz interactive element'));

    const prompts = [
      {
        type: 'input',
        name: 'elementName',
        message: 'Your element\'s name:',
        when: !this.options.elementName,
        validate: input => input !== '' || 'An element name is required',
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
        message: answers => `"${
          this.elementName || answers.elementName
        }" isn't the current working directory...\n  Should I create it initialize the element inside it?\n  Otherwise, I'll just initialize it in the current working directory`,
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
  }

  writing() {
    const elementName = this.elementName;
    const classPrefix = elementName;
    const { username, description, } = this.answers;
    const camelizedName = camelCase(elementName);
    const year = new Date().getFullYear();
    const langShort = this.answers.language.toLowerCase().slice(0, 3);
    const langCode = this.answers.language.toLowerCase().slice(0, 2);
    const direction = langCode === 'he' ? 'rtl' : 'ltr';
    const remotePath = `/c/static/${langShort}/${year}/${camelizedName}-project/`;
    const remotePathPre = `/c/static/${langShort}/${year}/${camelizedName}Pre-project/`;
    this.remotePath = remotePath;
    this.remotePathPre = remotePathPre;

    if (this.answers.createDir) {
      this.log(chalk.magenta(`Creating ${elementName}`));
      mkdirp(elementName);

      this.destinationRoot(this.destinationPath(elementName));
    }

    // copy files that do not require changing:
    // this.fs.copy(this.templatePath('unchanged/**'), this.destinationPath());
    this.fs.copy(
      this.templatePath('commitlint.config.js'),
      this.destinationPath('commitlint.config.js')
    );
    this.fs.copy(
      this.templatePath('rollup.config.js'),
      this.destinationPath('rollup.config.js')
    );
    this.fs.copy(
      this.templatePath('public/**'),
      this.destinationPath('public/')
    );
    this.fs.copy(this.templatePath('.*'), this.destinationPath());
    this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

    // copy templates:
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

    if (this.options.debug) {
      this.log(this.chalk.red('\nCopying from "public/"'));
      fs.readdirSync(this.templatePath('public'))
        .forEach(filename => {
          this.log(`${filename}:`, fs.existsSync(path.join(this.destinationPath(), filename)));
        });
      this.log();
      this.log(this.chalk.red('\nCopying dotfiles'));
      fs.readdirSync(this.templatePath())
        .filter(filename => filename.startsWith('.'))
        .forEach(filename => {
          this.log(`${filename}:`, fs.existsSync(path.join(this.destinationPath(), filename)));
        });
      this.log();
      this.log(this.chalk.red('\nCopying from "templates/"'));
      fs.readdirSync(this.templatePath('templates/pages'))
        .forEach(filename => {
          this.log(`${filename}:`, fs.existsSync(path.join(this.destinationPath(), `pages/${filename}`)));
        });
      fs.readdirSync(this.templatePath('templates/partials'))
        .forEach(filename => {
          this.log(`${filename}:`, fs.existsSync(path.join(this.destinationPath(), `partials/${filename}`)));
        });
      this.log();
      this.log(this.chalk.red('\nCopying from "scripts"'));
      fs.readdirSync(this.templatePath('scipts'))
        .forEach(filename => {
          this.log(`${filename}:`, fs.existsSync(path.join(this.destinationPath(), filename)));
        });
    }
  }

  installPackages() {
    this.isYarnAvailable = commandExistsSync('yarn');
    const install = (this.isYarnAvailable ? this.yarnInstall : this.npmInstall).bind(this);
    // Install devDependencies
    install(
      [
        '@babel/core',
        '@babel/preset-env',
        '@commitlint/cli',
        '@commitlint/config-conventional',
        '@haaretz/sass-selectors',
        '@haaretz/sass-type',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-node-resolve',
        '@rollup/plugin-replace',
        'autoprefixer',
        'chalk',
        'commitizen',
        'cross-spawn',
        'cross-env',
        'cssnano',
        'cz-conventional-changelog',
        'doctoc',
        'eslint',
        'eslint-config-airbnb-base',
        'eslint-plugin-import',
        'eslint-plugin-jest',
        'fs-extra',
        'glob',
        'husky',
        'jest',
        'jigsass-tools-mq',
        'lint-staged',
        'live-server',
        'lodash.template',
        'node-sass',
        'npm-run-all',
        'postcss-logical',
        'precss',
        'rollup',
        'rollup-plugin-babel',
        'rollup-plugin-delete',
        'rollup-plugin-postcss',
        'rollup-plugin-terser',
      ],
      { dev: true, }
    );

    // Install project dependencies
    install([
      'core-js',
      'dynamic-import-polyfill',
      'regenerator-runtime',
    ]);

    // Install user-selected dependencies
    if (this.answers.userdeps.length > 0) install(this.answers.userdeps);
  }

  install() {
    this.installDependencies({
      bower: false,
      npm: !this.isYarnAvailable,
      yarn: this.isYarnAvailable,
    });
  }

  end() {
    // const relativePath = path.relative(process.cwd(), this.destinationPath());
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
      chalk.yellow(`https://haaretz.co.il/st${this.remotePath}`)
    );

    this.log(chalk.cyan('* '));
    this.log(chalk.cyan('*   '), chalk.red.bold('yarn deploy:pre'));
    this.log(
      chalk.cyan('*     '),
      'Create a production-optimized build for testing purposes and deploy to:'
    );
    this.log(
      chalk.cyan('*     '),
      chalk.yellow(`https://haaretz.co.il/st${this.remotePathPre}`)
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

    const gitOptions = {
      // cwd: relativePath || './',
      encoding: 'utf-8',
    };

    // Initialize destination as a git repository and create an initial commit
    execSync('git init ./', gitOptions);
    execSync('git add ./', gitOptions);
    execSync('git commit --no-verify -m "chore: Initial commit"', gitOptions);

    this.log(
      chalk.cyan('* '),
      'Initialized a git repository and committed all base files.'
    );

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

function kebabCase(input) {
  return input.toLowerCase().split(' ').join('-');
}
