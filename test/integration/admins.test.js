/* eslint-disable global-require */
/* eslint-disable no-undef */
const _ = require('lodash');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Admin = require('../../models/admin');
const {
  superAdmin, validAdmin, invalidAdmin, adminList, randomId,
} = require('../utils/admin');
const server = require('../../app');


chai.use(chaiHttp);
const { expect, request } = chai;

describe('Admin', () => {
  let token;
  let superToken;

  const insertSuperAdmin = async () => {
    const admin = await new Admin(superAdmin);
    return admin;
  };

  beforeEach(async () => {
    token = new Admin().generateAuthToken();
    const admin = await insertSuperAdmin();
    superToken = await admin.generateAuthToken();
    await admin.save();
  });

  afterEach(async () => {
    await Admin.deleteMany({});
  });

  const insertAdmin = () => request(server).post('/api/admins').set('x-auth-token', superToken).send(validAdmin);

  const insertAdmins = async () => {
    await Admin.collection.insertMany(adminList);
  };

  const getSelf = async () => {
    const admin = await insertAdmin();
    return admin.header['x-auth-token'];
  };


  describe('GET /all', () => {
    const exec = (authToken) => request(server).get('/api/admins/all').set('x-auth-token', authToken);
    it('should return all admins if a super admin is logged in', async () => {
      await insertAdmins();
      const res = await exec(superToken);
      expect(res.body).to.have.property('admins');
      expect(res.body.admins).to.have.length(4);
    });

    it('should return 404 if there are no admins', async () => {
      await Admin.deleteMany({});
      const res = await exec(superToken);
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('You do not have any admin accounts');
    });

    it('should return 403 the admin is not authorized', async () => {
      await insertAdmins();
      const res = await exec(token);
      expect(res.status).to.equal(403);
      expect(res.body.message).to.equal('Forbidden');
    });
  });

  describe('GET /self', () => {
    const exec = (authToken) => request(server).get('/api/admins/self').set('x-auth-token', authToken);
    it('should return an admin\'s account if an admin is logged in', async () => {
      token = await getSelf();
      const res = await exec(token);
      expect(res.body).to.have.property('admin');
      expect(res.body.admin).to.have.property('firstName');
    });
  });

  describe('POST /', () => {
    describe('POST /api/admins', () => {
      const exec = (obj, authToken) => request(server).post('/api/admins').set('x-auth-token', authToken).send(obj);
      it('should create an admin successfully', async () => {
        const res = await exec(validAdmin, superToken);
        expect(res.status).to.be.equal(201);
        expect(res.body.admin).to.have.property('firstName', validAdmin.firstName);
      });

      it('should not create the same admin twice', async () => {
        await exec(validAdmin, superToken);
        const res = await exec(validAdmin, superToken);
        expect(res.status).to.be.equal(409);
        expect(res.body.message).to.equal(`Admin with email: ${validAdmin.email} already exist`);
      });

      it('should return a 400 status if an invalid admin object is provided', async () => {
        const res = await exec(invalidAdmin, superToken);
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('"firstName" must be a string');
      });

      it('should not create an admin if the user is not super admin', async () => {
        const res = await exec(validAdmin, token);
        expect(res.status).to.be.equal(403);
        expect(res.body.message).to.equal('Forbidden');
      });
    });

    describe('POST /api/admins/auth', () => {
      const exec = (obj) => request(server).post('/api/admins/auth').send(obj);
      it('should login an admin successfully', async () => {
        await insertAdmin();
        const res = await exec(_.pick(validAdmin, ['email', 'password']));
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('token');
      });

      it('should not login an admin with a non-existent email', async () => {
        await insertAdmin();
        const adObj = {
          email: 'ada@gmail.com',
          password: validAdmin.password,
        };
        const res = await exec(adObj);
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('Invalid email or password');
      });

      it('should not login an admin with an invalid password ', async () => {
        await insertAdmin();
        const adObj = {
          email: validAdmin.email,
          password: 'wrongpassword',
        };
        const res = await exec(adObj);
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('Invalid email or password');
      });
    });
  });

  describe('PUT /', () => {
    describe('PUT /api/admins', () => {
      const exec = (obj, authToken) => request(server).put('/api/admins').set('x-auth-token', authToken).send(obj);
      it('should update an admin\'s profile successfully once he or she is logged in', async () => {
        token = await getSelf();
        validAdmin.firstName = 'Dave';
        const res = await exec(_.pick(validAdmin, ['firstName']), token);
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal('Admin profile has been updated successfully');
      });

      it('should return a 400 if a bad request is made', async () => {
        token = await getSelf();
        const invalidOb = {
          firstName: 0,
        };
        const res = await exec(invalidOb, token);
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('"firstName" must be a string');
      });
    });

    describe('PUT /api/admins/super/:email', () => {
      const exec = (email, authToken) => request(server).put(`/api/admins/super/${email}`).set('x-auth-token', authToken);
      it('should update an admin\'s status to super admin successfully once a super admin is logged in', async () => {
        await insertAdmin();
        const res = await exec(validAdmin.email, superToken);
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal(`Admin with email: ${validAdmin.email} has been made a super admin successfully`);
      });

      it('should not update an admin\'s status to super admin if the logged in admin is not super', async () => {
        await insertAdmin();
        const res = await exec(validAdmin.email, token);
        expect(res.status).to.be.equal(403);
        expect(res.body.message).to.equal('Forbidden');
      });
    });
  });

  describe('DELETE /', () => {
    describe('DELETE /api/admins/:id', () => {
      const exec = (id, authToken) => request(server).delete(`/api/admins/${id}`).set('x-auth-token', authToken);
      it('should allow a super admin to delete any admin account apart from him or her self successfully', async () => {
        await insertAdmins();
        const { _id } = adminList[0];
        const res = await exec(_id, superToken);
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal('Admin profile has been deleted successfully');
      });

      it('should not allow a super admin to delete a non-existent admin', async () => {
        await insertAdmins();
        const res = await exec(randomId, superToken);
        expect(res.status).to.be.equal(404);
        expect(res.body.message).to.equal('The Admin with the given ID was not found');
      });

      it('should not allow a super admin to delete him or her self', async () => {
        await Admin.deleteMany({});
        const admin = await insertSuperAdmin();
        superToken = await admin.generateAuthToken();
        const { _id } = admin;
        await admin.save();
        const res = await exec(_id, superToken);
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.equal('You can not delete yourself');
      });
    });

    describe('DELETE /api/admins/self', () => {
      const exec = (authToken) => request(server).delete('/api/admins/self').set('x-auth-token', authToken);

      it('should allow an admin to delete him or her self', async () => {
        const res = await exec(superToken);
        expect(res.status).to.be.equal(200);
        expect(res.body.message).to.equal('Your admin profile has been deleted successfully');
      });
    });
  });
});
