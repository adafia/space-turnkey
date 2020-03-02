const Employee = require('../models/employee');
const { validateCreate, validateUpdate } = require('../helpers/validations/employeeValidation');

const EmployeeController = {
  async create(req, res) {
    // Validate user input
    const { error } = validateCreate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if employee already exist
    const found = await Employee.find({ email: req.body.email });
    if (found.length !== 0) return res.status(409).send({ message: `Employee with email: ${req.body.email} already exist` });

    // Save employee details
    const employee = new Employee({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      department: req.body.department,
      designation: req.body.designation,
      avatar: req.body.avatar,
    });

    await employee.save();
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

  async getEmployeesByDep(req, res) {
    const employees = await Employee.find({ department: req.params.department });

    if (employees.length === 0) return res.status(404).send(`There are no employees in the ${req.params.department} department`);
    return res.status(200).send({
      message: `Employees in the ${req.params.department} department have been fetched successfully`,
      employees,
    });
  },

  async updateEmployee(req, res) {
    const { error } = validateUpdate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const employee = await Employee.findById(req.params.id);

    await employee.updateOne({
      first_name: req.body.firstName ? req.body.firstName : employee.first_name,
      last_name: req.body.lastName ? req.body.lastName : employee.last_name,
      email: req.body.email ? req.body.email : employee.email,
      department: req.body.department ? req.body.department : employee.department,
      designation: req.body.designation ? req.body.designation : employee.designation,
      avatar: req.body.avatar ? req.body.avatar : employee.avatar,
    });

    await employee.save();

    if (!employee) return res.status(404).send({ message: 'The employee with the given ID was not found' });

    return res.status(200).send({
      message: 'Employee profile has been updated successfully',
    });
  },

  async deleteEmployee(req, res) {
    const employee = await Employee.findByIdAndRemove(req.params.id);

    if (!employee) {
      return res.status(404).send({ message: 'The employee with the given ID was not found' });
    }

    return res.status(200).send({
      message: 'Employee profile has been deleted successfully',
      employee,
    });
  },


};

module.exports = EmployeeController;
