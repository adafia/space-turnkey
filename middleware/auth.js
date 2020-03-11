const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.PRIVATE_KEY;

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send({ message: 'Access denied. No token provided' });

  try {
    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    return next();
  } catch (e) {
    return res.status(400).send({ message: 'Invalid token' });
  }
};
