const Employee = require('../models/employee');
const validateEmployee = require('../helpers/validations/employeeValidation');

const EmployeeController = {
  async create(req, res) {
    // Validate user input
    const { error } = validateEmployee(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if employee already exist
    const found = await Employee.find({ email: req.body.email });
    if (found.length !== 0) return res.status(409).send({ message: `Employee with email: ${req.body.email} already exist` });

    // Save employee details
    let employee = new Employee({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      designation: req.body.designation,
      avatar: req.body.avatar,
    });

    employee = await employee.save();
    return res.status(201).send({
      message: 'Employee profile has been created successfully',
      employee,
    });
  },

  async getEmployees(req, res) {
    const employees = await Employee.find();
    if (employees.length === 0) {
      return res.send({
        message: 'You do not have any employee profiles',
      });
    }
    return res.status(200).send({
      message: 'All employees have been fetched successfully',
      employees,
    });
  },

  async getEmployee(req, res) {
    const employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).send('The employee with the given ID was not found');
    return res.status(200).send({
      message: 'Employee profile has been fetched successfully',
      employee,
    });
  },

  async updateEmployee(req, res) {
    const { error } = validateEmployee(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const employee = await Employee.findByIdAndUpdate(req.params.id, {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      designation: req.body.designation,
      avatar: req.body.avatar,
    },
    { new: true });

    if (!employee) return res.status(404).send({ message: 'The employee with the given ID was not found' });

    return res.status(200).send({
      message: 'Employee profile has been updated succefully',
      employee,
    });
  },

  async deleteEmployee(req, res) {
    const employee = await Employee.findByIdAndRemove(req.params.id);

    if (!employee) {
      return res.status(404).send({ message: 'The employee with the given ID was not found' });
    }

    return res.status(200).send({
      message: 'Employee profile has been deleted succefully',
      employee,
    });
  },


};

module.exports = EmployeeController;
