const buildValidations = require('./build-utils/build-validations');
const commonConfig = require('./build-utils/webpack.common.js');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const addons = (/* string | string[] */ addonsArg) => {
  let addons = [...[addonsArg]] // Normalize array of addons (flatten)
    .filter(Boolean); // If addons is undefined, filter it out

  return addons.map(addonName => require(`./build-utils/addons/webpack.${addonName}.js`));
};

module.exports = env => {
  if (!env) {
    throw new Error(buildValidations.ERR_NO_ENV_FLAG);
  }

  const envConfig = require(`./build-utils/webpack.${env.env}.js`);
  const mergedConfig = webpackMerge(
    commonConfig,
    envConfig,
    ...addons(env.addons),
    {
      plugins: [
        new webpack.DefinePlugin({
          'process.env.API_URL': JSON.stringify(`${env.API_URL}`)
        })
      ]
    }
  );

  return mergedConfig;
};
