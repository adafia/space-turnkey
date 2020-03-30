/* eslint-disable global-require */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prodKeys');
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./testKeys');
} else {
  module.exports = require('./devKeys');
}
