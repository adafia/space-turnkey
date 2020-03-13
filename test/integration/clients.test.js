/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const Admin = require('../../models/admin');
const Client = require('../../models/client');
const { Project } = require('../../models/project');
const {
  clientList, randomId, validClient, validClientWithProject, invalidClient, validProject,
} = require('../utils/clients');
const server = require('../../app');


chai.use(chaiHttp);
const { expect, request } = chai;

describe('Clients', () => {
  let token;

  const insertClients = async () => {
    clientList.forEach(async (client) => {
      const projects = await Project.collection.insertMany(client.projects);
      // eslint-disable-next-line no-param-reassign
      client.projects = projects.ops;
    });
    const clients = await Client.collection.insertMany(clientList);
    return clients.ops;
  };

  beforeEach(async () => {
    await insertClients();
    token = await new Admin().generateAuthToken();
  });

  afterEach(async () => {
    await Client.deleteMany({});
    await Project.deleteMany({});
  });

  describe('GET /', () => {
    describe('/api/clients', () => {
      it('should return all client objects', async () => {
        const res = await request(server).get('/api/clients');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('clients');
      });
    });

    describe('/api/clients/:clientId', () => {
      const exec = (id) => request(server).get(`/api/clients/${id}`);
      it('should return a specified client object if a valid ID is provided', async () => {
        const { _id } = clientList[0];
        const res = await exec(_id);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('client');
      });

      it('should return a 404 client does not exist', async () => {
        const res = await exec(randomId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal(`client with the ID: ${randomId} does not exist or is invalid`);
      });
    });

    describe('/api/clients/:clientId/:projectId', () => {
      const exec = (clientId, projectId) => request(server).get(`/api/clients/${clientId}/${projectId}`);
      it('should return a specified client\'s projects if valid IDs are provided', async () => {
        const clientId = clientList[0]._id;
        const projectId = clientList[0].projects[0]._id;
        const res = await exec(clientId, projectId);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('project');
      });

      it('should return a 404 if the specified client does not exist', async () => {
        const projectId = clientList[0].projects[0]._id;
        const res = await exec(randomId, projectId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal(`client with the ID: ${randomId} does not exist or is invalid`);
      });

      it('should return a 404 if the specified client project does not exist', async () => {
        const clientId = clientList[0]._id;
        const res = await exec(clientId, randomId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal(`project with the ID: ${randomId} does not exist or is invalid`);
      });
    });
  });

  describe('POST /', () => {
    describe('/api/clients', () => {
      const exec = (clientObj) => request(server).post('/api/clients').set('x-auth-token', token).send(clientObj);
      it('should create a client without a project', async () => {
        const res = await exec(validClient);
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('client');
      });

      it('should not create a client with the same name twice', async () => {
        await exec(validClient);
        const res = await exec(validClient);
        expect(res.status).to.be.equal(409);
        expect(res.body.message).to.be.equal(`Client with name: ${validClient.name} already exist`);
      });

      it('should create a client with a project', async () => {
        const res = await exec(validClientWithProject);
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('client');
      });

      it('should not create a client with an invalid request', async () => {
        const res = await exec(invalidClient);
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equal('"name" must be a string');
      });
    });

    describe('/api/clients/:clientId/project', () => {
      const exec = (clientId, projectObj) => request(server).post(`/api/clients/${clientId}/project`).set('x-auth-token', token).send(projectObj);
      it('should add a project to an existing client object', async () => {
        const { _id } = clientList[0];
        const res = await exec(_id, validProject);
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('client');
      });

      it('should not add a project to a non-existent client object', async () => {
        const res = await exec(randomId, validProject);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.equal(`client with the ID: ${randomId} does not exist or is invalid`);
      });
    });
  });

  describe('DELETE /', () => {
    describe('/api/clients/:clientId', () => {
      const exec = (clientId) => request(server).delete(`/api/clients/${clientId}`).set('x-auth-token', token);
      it('should delete a client successfully', async () => {
        const { _id } = clientList[1];
        const res = await exec(_id);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('client');
      });
      it('should not delete a non-existent client', async () => {
        const res = await exec(randomId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.equal(`client with the ID: ${randomId} does not exist or is invalid`);
      });
    });

    describe('/api/clients/:clientId/:projectId', () => {
      const exec = (clientId, projectId) => request(server).delete(`/api/clients/${clientId}/${projectId}`).set('x-auth-token', token);
      it('should delete a project from an existing client object', async () => {
        const { _id } = clientList[0];
        const projectId = clientList[0].projects[0]._id;
        const res = await exec(_id, projectId);
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.be.equal('Client project has been deleted');
      });

      it('should not delete a project from a non-existent client', async () => {
        const projectId = clientList[0].projects[0]._id;
        const res = await exec(randomId, projectId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.equal(`client with the ID: ${randomId} does not exist or is invalid`);
      });

      it('should not delete a non-existent project from an existing client object', async () => {
        const { _id } = clientList[0];
        const res = await exec(_id, randomId);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.be.equal(`project with the ID: ${randomId} does not exist or is invalid`);
      });
    });
  });
});
