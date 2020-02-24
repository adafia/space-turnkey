const mongoose = require('mongoose');

const Employee = mongoose.model('Employee', new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255,
  },
  last_name: {
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
  },
  department: {
    type: String,
    required: true,
    enum: ['Human Resource', 'Engineering', 'Operations'],
  },
  designation: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  avatar: String,
}));

module.exports = Employee;
