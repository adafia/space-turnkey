const mongoose = require('mongoose');

const Employee = mongoose.model('Employee', new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  designation: { type: String, required: true },
  avatar: { data: Buffer, contentType: String },
}));

module.exports = Employee;
