/* eslint-disable global-require */
/* eslint-disable no-undef */
const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Employee = require('../../models/employee');
const Admin = require('../../models/admin');
const {
  employeeList, deletedId, validEmployee, invalidEmployee,
} = require('../utils/employees');
const server = require('../../app');


chai.use(chaiHttp);
const { expect, request } = chai;

describe('Employees', () => {
  let token;
  beforeEach(async () => {
    token = new Admin().generateAuthToken();
  });

  afterEach(async () => {
    await Employee.deleteMany({});
  });

  const insertEmployees = async () => {
    await Employee.collection.insertMany(employeeList);
  };

  const insertEmployee = async (obj) => {
    const employee = new Employee(obj);
    await employee.save();
    return employee;
  };

  describe('GET /', () => {
    const exec = () => request(server).get('/api/employees');
    it('should return all employees', async () => {
      await insertEmployees();
      const res = await exec();
      expect(res.body).to.have.property('employees');
      expect(res.body.employees).to.have.length(3);
    });
    it('should return a 404 if there are no employees in the db', async () => {
      const res = await exec();
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal('You do not have any employee profiles');
    });
  });

  describe('GET /:id', () => {
    const exec = (id) => request(server).get(`/api/employees/${id}`);
    it('should return an employee if a valid id is provided', async () => {
      const employee = await insertEmployee(employeeList[0]);
      const { _id } = employee;
      const res = await exec(_id);
      expect(res.body.employee).to.have.property('firstName', employee.firstName);
    });

    it('should return invalid ID if an invalid id is provided', async () => {
      const res = await exec(1);
      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.be.equal('Invalid ID.');
    });

    it('should return a 404 if the specified empoyee id does not exist', async () => {
      const res = await exec(deletedId);
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal('The employee with the given ID was not found');
    });
  });

  describe('GET /:department/dep', () => {
    const exec = (department) => request(server).get(`/api/employees/${department}/dep`);
    it('should return all employees of a specified department if a valid department is provided', async () => {
      await insertEmployees();
      const res = await exec('Operations');
      const { employees } = res.body;
      expect(employees).to.have.length(2);
    });

    it('should return a 400, if an invalid department is provided', async () => {
      await insertEmployees();
      const res = await exec('blue');
      expect(res.status).to.be.equal(400);
      expect(res.body.message).to.be.equal('"department" must be one of [human resource, engineering, operations]');
    });

    it('should return a 404 if there are no employees in the specified department', async () => {
      await insertEmployees();
      const res = await exec('human resource');
      expect(res.status).to.be.equal(404);
      expect(res.body.message).to.be.equal('There are no employees in the human resource department');
    });
  });

  describe('POST /', () => {
    describe('POST /api/employees', () => {
      const exec = (obj) => request(server).post('/api/employees').set('x-auth-token', token).send(obj);
      it('should create an employee successfully', async () => {
        const res = await exec(validEmployee);
        expect(res.status).to.be.equal(201);
        expect(res.body.employee).to.have.property('firstName', validEmployee.firstName);
      });

      it('should return 401 if no token is provided', async () => {
        token = '';
        const res = await exec(validEmployee);
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Access denied. No token provided');
      });

      it('should return 409 if an employee with the same email already exists', async () => {
        await exec(validEmployee);
        const res = await exec(validEmployee);
        expect(res.status).to.equal(409);
        expect(res.body.message).to.equal(`Employee with email: ${validEmployee.email} already exist`);
      });

      it('should return 400 if an invalid employee object is sent', async () => {
        const res = await exec(invalidEmployee);
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('"email" must be a valid email');
      });
    });
  });

  describe('PUT /', () => {
    describe('PUT /api/employees/:id', () => {
      beforeEach(async () => {
        await insertEmployees();
      });

      const exec = (id, obj) => request(server).put(`/api/employees/${id}`).set('x-auth-token', token).send(obj);
      it('should update an employee profile successfully', async () => {
        const { _id } = employeeList[0];
        employeeList[0].firstName = 'Joseph';
        const res = await exec(_id, _.pick(employeeList[0], ['firstName']));
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal('Employee profile has been updated successfully');
      });

      it('should return 400 when an invalid update is made', async () => {
        const { _id } = employeeList[0];
        employeeList[0].lastName = 2;
        const res = await exec(_id, _.pick(employeeList[0], ['lastName']));
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('"lastName" must be a string');
      });

      it('should return 400 when an invalid id is provided', async () => {
        employeeList[0].firstName = 'Joseph';
        const res = await exec(1, _.pick(employeeList[0], ['firstName']));
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('Invalid ID.');
      });

      it('should return 404 if id was not found', async () => {
        employeeList[1].firstName = 'Samuel';
        const res = await exec(deletedId, _.pick(employeeList[1], ['firstName']));
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal('The employee with the given ID was not found');
      });
    });
  });

  describe('DELETE /', () => {
    describe('DELETE /api/employees/:id', () => {
      beforeEach(async () => {
        await insertEmployees();
      });

      const exec = (id) => request(server).delete(`/api/employees/${id}`).set('x-auth-token', token);
      it('should delete an employee profile successfully', async () => {
        const { _id } = employeeList[0];
        const res = await exec(_id);
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal('Employee profile has been deleted successfully');
      });

      it('should not delete an employee that does not exist', async () => {
        const res = await exec(deletedId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal('The employee with the given ID was not found');
      });
    });
  });
});
