const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

// local configurations
const configureLoaders = require('./webpack.loaders');
const configurePlugins = require('./webpack.plugins');

module.exports = (env) => {
  const { isProduction, PUBLIC_PATH, OUTPUT_DIR, ENTRY } = env;
  const exists = path.resolve(ENTRY);
  if (!exists) {
    throw new Error('Entry not found');
  }
  return {
    entry: ENTRY,
    mode: isProduction ? 'production' : 'development',
    module: configureLoaders(env),
    resolve: {
      extensions: ['*', '.js', '.jsx'],
      alias: {
        '@': path.resolve(ENTRY),
      },
    },
    // devtool: 'inline-module-source-maps',
    output: {
      path: path.resolve(OUTPUT_DIR),
      publicPath: PUBLIC_PATH,
      filename: isProduction ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
      chunkFilename: isProduction
        ? 'js/[name].[chunkhash:8].chunk.js'
        : 'js/[name].chunk.js',
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            mangle: {
              safari10: true,
            },
          },
          parallel: true,
        }),
      ],
      chunkIds: 'named',
      runtimeChunk: true,
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          react: {
            test: /node_modules\/?(react|react-dom|react-router-dom)[\\/]/,
            name: 'react',
            chunks: 'initial',
            reuseExistingChunk: false,
          },
          chakra: {
            test: /node_modules\/?(chakra-ui|@chakra-ui|@chakra-ui)[\\/]/,
            name: 'chakra',
            chunks: 'initial',
          },
          defaultVendors: {
            test: /node_modules\/(?!(react|react-dom|react-router-dom|@chakra-ui)\/).*/,
            maxSize: 300000,
            name: 'vendor',
            chunks: 'initial',
          },
          styles: {
            name: 'styles',
            test: /\.(le|sc|c)?ss$/,
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    },
    plugins: configurePlugins(env),
  };
};
