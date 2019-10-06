module.exports = (api) => {
  // api.cache(true);
  const isTest = api.env(['test']);
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

  const env = {
    test: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-transform-runtime',
      ],
    },
  };
  if (isTest) {
    return env.test;
  }

  return { plugins, presets, env };
};
