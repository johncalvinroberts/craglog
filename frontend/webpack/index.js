require('dotenv').config();
const webpack = require('webpack');
const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const WebpackDevServer = require('webpack-dev-server');
const configureWebpack = require('./webpack.config');
const configureEnv = require('./webpack.env');
const configureDevServer = require('./webpack.dev-server');

/* eslint-disable no-console */

// Makes the script crash on unhandled rejections instead of silently ignoring them.
process.on('unhandledRejection', (err) => {
  throw err;
});

const handleError = (error) => {
  console.log(chalk.cyan(' ^ ^ '));
  console.log(chalk.cyan('(O,O)'));
  console.log(chalk.cyan('(   )'));
  console.log(chalk.cyan('-"-"---dwb-'));
  console.error(chalk.red(error));
  process.exit(1);
};

// simple webpack callback, doesn't format messages or anything
// just checks if any errors returned or if signal interrupted
const webpackCallBack = (error) => {
  if (error) handleError(error);

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => process.exit(0));
  });
};

// IIFE - run function of build script
(async () => {
  clearConsole();
  const env = await configureEnv();
  const devServerOptions = configureDevServer(env);
  const compiler = webpack(configureWebpack(env));
  // port defaults to 3000, env defaults to development
  const { WEBPACK_DEV_PORT = 3000, NODE_ENV = 'development' } = process.env;
  const { isProduction } = env;
  console.log(
    chalk.magenta.bold(`

    Running build in ${NODE_ENV} mode!!
    
    `),
  );
  if (!isProduction) {
    // if dev mode, run webpack dev server
    const server = new WebpackDevServer(compiler, devServerOptions);
    server.listen(WEBPACK_DEV_PORT, '0.0.0.0', webpackCallBack);
  }

  if (isProduction) {
    // if is production mode, just build
    compiler.run(webpackCallBack);
  }
})();
/* eslint-enable no-console */
