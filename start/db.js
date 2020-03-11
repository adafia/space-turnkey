const mongoose = require('mongoose');
const debug = require('../helpers/debug');
require('dotenv').config();

const connectionString = process.env.MONGODB_CONNECTION_STRING_DEV;

const dbInit = () => {
  // MongoDB database connection
  const db = mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  db.then(() => debug('- Connected to MongoDB... -'))
    .catch((error) => debug('- Could not connect to MongoDB... -', error));
};

module.exports = dbInit;
