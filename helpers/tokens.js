const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.PRIVATE_KEY;

const Tokens = {
  async sign(payload) {
    const token = await jwt.sign(payload, secret);
    return token;
  },

};

module.exports = Tokens;
