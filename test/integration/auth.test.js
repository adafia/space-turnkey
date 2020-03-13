/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const { employeeList } = require('../utils/employees');
const Admin = require('../../models/admin');
const Employee = require('../../models/employee');
const server = require('../../app');

chai.use(chaiHttp);
const { expect, request } = chai;

describe('auth middleware', () => {
  let token;

  beforeEach(() => {
    token = new Admin().generateAuthToken();
  });
  afterEach(async () => {
    await Employee.deleteMany({});
  });

  const exec = () => request(server).post('/api/employees').set('x-auth-token', token).send(employeeList[2]);

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).to.equal(401);
  });

  it('should return 400 if an invalid token is provided', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).to.equal(400);
  });

  it('should return 200 if a valid token is provided', async () => {
    const res = await exec();
    expect(res.status).to.equal(201);
  });
});
