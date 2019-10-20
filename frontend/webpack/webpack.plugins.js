const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCopyPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const DonePlugin = require('./webpack.done');

module.exports = (env) => {
  const { isProduction, ENTRY } = env;

  let plugins = [
    new webpack.DefinePlugin(env.stringified),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(ENTRY, 'index.html'),
      templateParameters: {
        ...env,
      },
      ...(isProduction && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    }),
    new WebpackCopyPlugin([
      { from: 'src/assets/*', to: 'assets', flatten: true },
    ]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ];

  if (isProduction) {
    plugins = [
      ...plugins,
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: 'local',
        navigateFallback: '/index.html',
        navigateFallbackBlacklist: [
          // Exclude URLs starting with /_, as they're likely an API call
          new RegExp('^/_'),
          // Exclude URLs containing a dot, as they're likely a resource in
          // public/ and not a SPA route
          new RegExp('/[^/]+\\.[^/]+$'),
        ],
      }),
      new CaseSensitivePathsPlugin(),
      // MiniCssExtractPlugin - runs in production, extracts css into stylesheets
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'bundle-size.json',
        statsOptions: {
          source: false,
        },
      }),
      new DonePlugin(),
    ];
  }
  return plugins;
};
