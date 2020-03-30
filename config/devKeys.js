require('dotenv').config();

module.exports = {
  DATABASE_URL: process.env.MONGODB_CONNECTION_STRING,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};
