const chalk = require('chalk');
const commonConfig = require('./build-utils/webpack.common.js');

const webpack = require('webpack');
const { merge } = require('webpack-merge')

const addons = (/* string | string[] */ addonsArg) => {
  let addons = [...[addonsArg]] // Normalize array of addons (flatten)
    .filter(Boolean); // If addons is undefined, filter it out

  return addons.map(addonName => require(`./build-utils/addons/webpack.${addonName}.js`));
};

module.exports = env => {
  if (!env['env']) {
    throw new Error(`You must pass an '--env env=dev|prod' flag into your build for webpack to work!`);
  }
  
  if (!env['API_URL']) {
    console.log(`${chalk.yellow('Warning! API_URL is undefined')}`);
  }

  const envConfig = require(`./build-utils/webpack.${env.env}.js`);
  const mergedConfig = merge(
    commonConfig,
    envConfig,
    ...addons(env.addons),
    {
      plugins: [
        new webpack.DefinePlugin({
          'process.env.API_URL': JSON.stringify(`${env.API_URL}`)
        }),
        new webpack.ProvidePlugin({
          'React': 'react',
          'ReactDOM': 'react-dom',
        }),
      ]
    }
  );

  return mergedConfig;
};
