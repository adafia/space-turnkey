const express = require('express');
const morgan = require('morgan');
const logger = require('./helpers/Logger');


const app = express();
require('./start/routes')(app);
require('./start/db')();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  logger.log('- Morgan enabled... -');
}

app.get('/', (req, res) => {
  res.send('Hello from Space Turnkey Solutions API');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => logger.log(`- Listening on port ${port}... -`));

module.exports = server;
