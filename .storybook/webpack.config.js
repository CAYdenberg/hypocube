// load the default config generator.
// const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = ({ config }) => {
  // const config = genDefaultConfig(baseConfig, env);
  // Extend it as you need.
  // For example, add typescript loader:
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};
