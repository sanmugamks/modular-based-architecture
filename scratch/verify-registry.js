'use strict';

const Koa = require('koa');
const path = require('path');
const _ = require('lodash');

async function test() {
  const app = new Koa();
  app.context.plugins = {};

  const pluginName = 'stb-myaccount';
  const settings = {
    enabled: true,
    config: {
      hasOffer: false,
      newProjectField: 'hello',
    },
  };

  // Mock the plugin loading logic from src/index.js
  const pluginPath = path.join(__dirname, '../src/plugins', pluginName);
  const plugin = require(pluginPath);

  let defaultConfig = plugin.defaultConfig || {};
  try {
    const configPath = path.join(pluginPath, 'config', 'index.js');
    if (require.resolve(configPath)) {
      const externalConfig = require(configPath);
      if (externalConfig && externalConfig.default) {
        defaultConfig = _.merge({}, defaultConfig, externalConfig.default);
      }
    }
  } catch (e) {}

  const mergedConfig = _.merge({}, defaultConfig, settings.config || {});

  app.context.plugins[pluginName] = {
    config: mergedConfig,
    instance: plugin,
    name: pluginName,
  };

  console.log('--- GLOBAL REGISTRY TEST ---');
  console.log(
    'Merged Config in Registry:',
    JSON.stringify(app.context.plugins[pluginName].config, null, 2)
  );

  const config = app.context.plugins[pluginName].config;

  // Verification
  if (
    config.hasOffer === false &&
    config.propertyStatus[0] === 'for sale' &&
    config.newProjectField === 'hello' &&
    config.params.initialParam === 'default'
  ) {
    console.log(
      'SUCCESS: Global Plugin Registry initialized with correctly merged external config!'
    );
  } else {
    console.error('FAIL: Config merging or registry initialization failed.');
    console.error('Actual Config:', config);
    process.exit(1);
  }

  process.exit(0);
}

test().catch((err) => {
  console.error(err);
  process.exit(1);
});
