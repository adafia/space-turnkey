const mongoose = require('mongoose');

module.exports.employeeList = [
  {
    firstName: 'joe',
    lastName: 'edem',
    email: 'joe.edem@gmail.com',
    department: 'engineering',
    designation: 'Senior Engineer',
    avatar: 'string',
  },
  {
    firstName: 'sam',
    lastName: 'smith',
    email: 'sam.smith@gmail.com',
    department: 'operations',
    designation: 'Senior Engineer',
    avatar: 'string',
  },
  {
    firstName: 'kwaku',
    lastName: 'macho',
    email: 'macho.kwaku@gmail.com',
    department: 'operations',
    designation: 'Senior Engineer',
    avatar: 'string',
  },
];

module.exports.deletedId = new mongoose.Types.ObjectId().toHexString();

module.exports.invalidEmployee = {
  firstName: 'joe',
  lastName: 'edem',
  email: 'joe.edemgmail.com',
  department: 'engineering',
  designation: 'Senior Engineer',
  avatar: 'string',
};

module.exports.validEmployee = {
  firstName: 'sam',
  lastName: 'smith',
  email: 'sam.smith@gmail.com',
  department: 'operations',
  designation: 'Senior Engineer',
  avatar: 'string',
};
