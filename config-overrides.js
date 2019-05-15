'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const {paths} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
// load environment variables from .env files
// before overrides scripts are read
require(paths.scriptVersion + '/config/env');
const override = require(paths.configOverrides);

const webpack = typeof override === 'function'
    ? override
    : override.webpack || ((config, env) => config);

if (override.devserver) {
  console.log(
      'Warning: `devserver` has been deprecated. Please use `devServer` instead as ' +
      '`devserver` will not be used in the next major release.'
  )
}

const devServer = override.devServer || override.devserver
    || ((configFunction) =>
        (proxy, allowedHost) =>
            configFunction(proxy, allowedHost));

const jest = override.jest || ((config) => config);

const pathsOverride = override.paths || ((paths, env) => paths);

// normalized overrides functions
module.exports = {
  webpack: function (config, env) {
    var config=webpack(config, env);

    //less
    config = rewireLess.withLoaderOptions({
      javascriptEnabled: true
    })(config, env);

    //alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve('src')
    };
    return config
  },
 /* devServer:  function (configFunction) {
    return function (proxy, allowedHost) {
      var config = devServer(configFunction)(proxy, allowedHost);
      // var config={};

      //取消自动打开浏览器
      config.open = false

      return config
    }
  },*/
  devServer:devServer,
  jest,
  paths: pathsOverride
};
