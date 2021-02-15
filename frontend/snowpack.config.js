/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: {
    public: '/',
    src: '/dist',
  },
  plugins: [
    // '@snowpack/plugin-webpack',
    '@snowpack/plugin-babel',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
  ],
  // packageOptions: {
  //   source: 'remote',
  // },
  // optimize: {
  //   bundle: true,
  //   minify: true,
  //   target: 'es2018',
  // },
};
