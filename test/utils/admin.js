const mongoose = require('mongoose');

module.exports.superAdmin = {
  firstName: 'Samuel',
  lastName: 'Adafia',
  email: 'adafia.samuel@gmail.com',
  password: 'alloha',
  isSuperAdmin: true,
};

module.exports.validAdmin = {
  firstName: 'David',
  lastName: 'Adafia',
  email: 'adafia.david@gmail.com',
  password: 'alloha',
};

module.exports.invalidAdmin = {
  firstName: 1,
  lastName: 'Adafia',
  email: 'adafia.david@gmail.com',
  password: 'alloha',
};

module.exports.randomId = new mongoose.Types.ObjectId().toHexString();

module.exports.adminList = [
  {
    firstName: 'One',
    lastName: 'une',
    email: 'one.une@gmail.com',
    password: 'alloha',
  },
  {
    firstName: 'Two',
    lastName: 'Duo',
    email: 'two.duo@gmail.com',
    password: 'alloha',
  },
  {
    firstName: 'Three',
    lastName: 'Trio',
    email: 'three.trio@gmail.com',
    password: 'alloha',
  },
];
