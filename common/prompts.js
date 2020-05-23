const path = require('path');
const chalk = require('chalk');
const kebabCase = require('./kebabCase');

module.exports = function prompts() {
  return [
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
};
