const express = require('express');
const employee = require('../controller/employee');

const router = express.Router();

router.post('/', employee.create);
router.get('/', employee.getEmployees);
router.get('/:id', employee.getEmployee);
router.put('/:id', employee.updateEmployee);
router.delete('/:id', employee.deleteEmployee);

module.exports = router;
