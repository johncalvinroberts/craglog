module.exports = (api) => {
  api.cache(true);
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        // see also zloirock/core-js https://bit.ly/2JLnrgw
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
  ];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-syntax-dynamic-import',
  ];

  return { plugins, presets };
};
