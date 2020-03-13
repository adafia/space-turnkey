const express = require('express');
const employee = require('../controller/employee');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { tryCatchWrap } = require('../middleware/async');

const router = express.Router();

router.post('/', auth, tryCatchWrap(employee.create));
router.get('/', tryCatchWrap(employee.getEmployees));
router.get('/:id', validateObjectId, tryCatchWrap(employee.getEmployee));
router.get('/:department/dep', tryCatchWrap(employee.getEmployeesByDep));
router.put('/:id', auth, validateObjectId, tryCatchWrap(employee.updateEmployee));
router.delete('/:id', auth, validateObjectId, tryCatchWrap(employee.deleteEmployee));

module.exports = router;
