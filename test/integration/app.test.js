/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp);
const { expect, request } = chai;

describe('GET /', () => {
  it('should return a welcome message to the screen', async () => {
    const res = await request(server).get('/');
    expect(res.text).to.be.equal('Hello from Space Turnkey Solutions API');
  });
});
