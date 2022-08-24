module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve ??= {};
      webpackConfig.resolve.fallback ??= {};
      webpackConfig.resolve.fallback.fs = false;
      webpackConfig.resolve.fallback.path = false;

      webpackConfig.experiments ??= {};
      webpackConfig.experiments.topLevelAwait = true;

      return webpackConfig;
    },
  },
};
