/* eslint-disable no-undef */
const { expect } = require('chai');
const { hash } = require('../../helpers/hash');
const { sign } = require('../../helpers/tokens');

it('hash', async () => {
  const result = await hash('password');
  expect(result.length).to.be.equal(60);
});

it('token', async () => {
  const user = {
    id: 1,
    first_name: 'Edem',
  };
  const result = await sign(user);
  expect(typeof result).to.be.a('string');
});
