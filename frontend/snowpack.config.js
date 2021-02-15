/** @type {import("snowpack").SnowpackUserConfig } */

module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-webpack',
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-babel',
  ],
  packageOptions: {
    source: 'remote',
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018',
  },
};
