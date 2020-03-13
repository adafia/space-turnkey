require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.MONGODB_CONNECTION_STRING_DEV,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};
