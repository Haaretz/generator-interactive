/* eslint-disable import/no-extraneous-dependencies */
module.exports = require('babel-jest').createTransformer({
  presets: [ [ '@babel/preset-env', { targets: { node: 'current', }, }, ], ],
});
