const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');

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

app.listen(port, () => debug(`- Listening on port ${port}... -`));
