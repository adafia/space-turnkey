const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const mongoose = require('mongoose');
const employees = require('./routes/employees');
const clients = require('./routes/clients');
const admins = require('./routes/admins');
const error500 = require('./middleware/error');
require('dotenv').config();
// const { stream } = require('./helpers/multer');

const connectionString = process.env.MONGODB_CONNECTION_STRING;

// MongoDB database connection
const db = mongoose.connect(connectionString, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
});
db.then(() => debug('- Connected to MongoDB... -'))
  .catch((error) => debug('- Could not connect to MongoDB... -', error));

// Opening a connection between GridFs and MongoDB
// db.once('open', stream(db.db, mongoose.mongo))
//   .then(debug('- Connection open -'))
//   .catch((error) => debug('- Error opening the connection -', error));

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/employees', employees);
app.use('/api/clients', clients);
app.use('/api/admins', admins);


if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('- Morgan enabled... -');
}


app.get('/', (req, res) => {
  res.send('Hello from Space Turnkey Solutions API');
});

app.use(error500);

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`- Listening on port ${port}... -`));
