const prodKeys = require('./prodKeys');
const devKeys = require('./devKeys');
const testKeys = require('./testKeys');


if (process.env.NODE_ENV === 'production') module.exports = prodKeys;

if (process.env.NODE_ENV === 'test') {
  module.exports = testKeys;
}

module.exports = devKeys;
