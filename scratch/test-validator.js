'use strict';

const validator = require('../src/plugins/stb-myaccount/config/index.js').validator;

function runTest(name, config) {
  console.log(`--- Test: ${name} ---`);
  try {
    validator(config);
    console.log('SUCCESS: Validation passed.');
  } catch (err) {
    console.log('EXPECTED ERROR:', err.message);
  }
  console.log('--------------------\n');
}

// 1. Valid Config
runTest('Valid Config', {
  hasOffer: false,
  propertyStatus: ['for rent'],
});

// 2. Invalid hasOffer (String instead of Boolean)
runTest('Invalid hasOffer', {
  hasOffer: 'false',
  propertyStatus: ['for sale'],
});

// 3. Invalid propertyStatus (Object instead of Array)
runTest('Invalid propertyStatus', {
  hasOffer: true,
  propertyStatus: { status: 'for sale' },
});
