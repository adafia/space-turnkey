const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const mongoose = require('mongoose');
const employees = require('./routes/employees');
require('dotenv').config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => debug('connected to MongoDB...'))
  .catch((err) => debug('Could not connect to MongoDB...', err));

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/employees', employees);


if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}


app.get('/', (req, res) => {
  res.send('Hello from Space Turnkey Solutions API');
});


const port = process.env.PORT || 3000;

app.listen(port, () => debug(`Listening on port ${port}...`));
