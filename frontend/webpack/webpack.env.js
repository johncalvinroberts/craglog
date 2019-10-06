function stringifyKeys(source) {
  return Object.keys(source).reduce((memo, key) => {
    memo[key] = JSON.stringify(source[key]);
    return memo;
  }, {});
}

module.exports = async () => {
  // set babel env
  process.env.BABEL_ENV = process.env.NODE_ENV;
  // Stringify all values so we can feed into Webpack DefinePlugin
  const processVariables = process.env;
  const args = process.argv.slice(2);
  // get entry point from command line argument
  const ENTRY = './src';
  const OUTPUT_DIR = './dist';
  const PUBLIC_PATH = '/';
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test';
  // also provide optional hot module replacement
  const isHot = !!args.find((arg) => arg === '--hot') || true;

  // for webpack define
  const env = {
    ENTRY,
    OUTPUT_DIR,
    PUBLIC_PATH,
    isHot,
    isProduction,
  };

  // omni configuration is available on __OMNI__
  // make process.env available as well
  const stringified = {
    'process.env': stringifyKeys(processVariables),
  };

  return {
    ...env,
    stringified,
  };
};
