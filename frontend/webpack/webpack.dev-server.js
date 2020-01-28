// options to pass to WebpackDevServer
module.exports = (env) => {
  const { isHot, CONTENT_BASE, PUBLIC_PATH } = env;

  return {
    contentBase: CONTENT_BASE || PUBLIC_PATH,
    overlay: true,
    publicPath: PUBLIC_PATH,

    hotOnly: isHot,
    historyApiFallback: true,
    proxy: {
      '/api': process.env.API_BASE_URL,
      '/api/jobs': process.env.JOBS_BASE_URL,
    },
    stats: {
      entrypoints: false,
      errors: true,
      warnings: true,
      errorDetails: true,
      modules: false,
      performance: true,
      providedExports: false,
      moduleTrace: false,
      colors: true,
      children: false,
      chunkModules: false,
      chunkOrigins: false,
      chunkGroups: false,
      chunksSort: 'size',
      excludeModules: true,
      hash: false,
      version: false,
      builtAt: false,
      timings: false,
      usedExports: true,
    },
  };
};
