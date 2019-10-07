const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const BABEL_EXCLUDE = /node_modules\/(?!(@chakra-ui)\/).*/;

// webpack loaders
module.exports = (env) => {
  const { isProduction, isHot } = env;
  // only use MiniCssExtractPlugin loader in production
  // if development, use 'style-loader'
  const cssLoaders = [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    // use autoprefixer + cssnano if in production
    isProduction && {
      loader: 'postcss-loader',
      options: {
        sourceMap: false,
        include: /node_modules/,
        plugins() {
          return [autoprefixer(), cssnano()];
        },
      },
    },
  ].filter(Boolean);

  const rules = [
    {
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: BABEL_EXCLUDE,
      options: {
        cacheDirectory: true,
        cacheCompression: isProduction,
        compact: isProduction,
      },
    },
    {
      test: /\.css$/,
      use: cssLoaders,
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader'],
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      loader: 'file-loader',
      options: {
        name: 'media/[name].[hash:8].[ext]',
      },
    },
  ];

  // use react hot loader if --hot is passed in cli
  if (isHot && !isProduction) {
    rules.push({
      test: /\.js?$/,
      use: ['react-hot-loader/webpack'],
    });
  }

  return {
    rules,
  };
};
