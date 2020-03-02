const mongoose = require('mongoose');
const { projectSchema } = require('./project');

const Client = mongoose.model('Client', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  logo: { type: String },
  projects: [projectSchema],
}));

module.exports = Client;
