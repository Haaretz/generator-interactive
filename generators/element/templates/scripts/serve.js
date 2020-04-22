#!/usr/bin/env node

/* eslint import/no-extraneous-dependencies: [ "error", { "devDependencies": true } ] */

const path = require('path');
const liveServer = require('live-server');

const { PORT = 5000, WAIT = 500, HOST, OPEN, DEBUG, } = process.env;

const params = {
  port: PORT,
  host: HOST || '127.0.0.1',
  wait: WAIT,
  open: !!OPEN || !!HOST,
  root: path.join('public/'),
};

if (DEBUG) {
  const chalk = require('chalk');
  console.log();
  console.log(chalk.red('Env:'));
  Object.entries({ PORT, HOST, WAIT, OPEN, }).forEach(([ param, val, ]) => {
    console.log(`${chalk.cyan(param)}: ${val} (${typeof val})`);
  });
  console.log();
  console.log(chalk.red('Params:'));
  Object.entries(params).forEach(([ param, val, ]) => {
    console.log(`${chalk.cyan(param)}: ${val} (${typeof val})`);
  });
  console.log();
}

liveServer.start(params);
