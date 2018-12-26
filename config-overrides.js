'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  //less
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true
  })(config, env);

  //alias
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': resolve('src')
  };
  return config;
};
