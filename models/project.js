const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: String },
});

const Project = mongoose.model('Project', projectSchema);

module.exports.projectSchema = projectSchema;
module.exports.Project = Project;
