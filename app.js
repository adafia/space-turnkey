const express = require('express');
const morgan = require('morgan');
const debug = require('./helpers/debug');

const app = express();
require('./start/routes')(app);
require('./start/db')();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('- Morgan enabled... -');
}

const port = process.env.PORT || 3000;

const server = app.listen(port, () => debug(`- Listening on port ${port}... -`));

module.exports = server;
