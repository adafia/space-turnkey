const express = require('express');
const employees = require('../routes/employees');
const clients = require('../routes/clients');
const admins = require('../routes/admins');

const Routes = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/employees', employees);
  app.use('/api/clients', clients);
  app.use('/api/admins', admins);
};

module.exports = Routes;
