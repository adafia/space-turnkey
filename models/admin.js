const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.PRIVATE_KEY;

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1024,
  },
  isSuperAdmin: Boolean,
});

// eslint-disable-next-line func-names
adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({
    // eslint-disable-next-line no-underscore-dangle
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    isSuperAdmin: this.isSuperAdmin,
  }, secret);
  return token;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
