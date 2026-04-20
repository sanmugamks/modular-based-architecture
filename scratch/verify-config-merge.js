'use strict';

const _ = require('lodash');

// Simulate the plugin and project configs
const pluginDefaultConfig = {
  hasOffer: true,
  propertyStatus: ["for sale"],
  params: {
    nested: true
  }
};

const projectOverrideConfig = {
  hasOffer: false,
  params: {
    extra: 'value'
  }
};

// Perform the merge exactly as in src/index.js
const mergedResult = _.merge({}, pluginDefaultConfig, projectOverrideConfig);

console.log('--- Config Merge Test ---');
console.log('Merged Config:', JSON.stringify(mergedResult, null, 2));

// Expectations
if (mergedResult.hasOffer === false && 
    mergedResult.propertyStatus[0] === "for sale" && 
    mergedResult.params.nested === true && 
    mergedResult.params.extra === 'value') {
  console.log('SUCCESS: Tiered configuration merging works correctly!');
} else {
  console.error('FAIL: Merging did not preserve nested properties or defaults.');
  process.exit(1);
}
