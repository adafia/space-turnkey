const mongoose = require('mongoose');

module.exports.clientList = [
  {
    name: 'Client 1',
    logo: 'client 1 logo',
    projects: [
      {
        name: 'Project 1 - Client 1',
        description: 'Project 1 description',
        size: 'size of project 1',
      },
      {
        name: 'Project 2 - Client 1',
        description: 'Project 2 description',
        size: 'size of project 2',
      },
    ],
  },
  {
    name: 'Client 2',
    logo: 'client 2 logo',
    projects: [
      {
        name: 'Project 1 - Client 2',
        description: 'Project 1 description',
        size: 'size of project 1',
      },
      {
        name: 'Project 2 - Client 2',
        description: 'Project 2 description',
        size: 'size of project 2',
      },
    ],
  },
  {
    name: 'Client 3',
    logo: 'client 3 logo',
    projects: [
      {
        name: 'Project 1 - Client 3',
        description: 'Project 1 description',
        size: 'size of project 1',
      },
      {
        name: 'Project 2 - Clinet 3',
        description: 'Project 2 description',
        size: 'size of project 2',
      },
    ],
  },
];

module.exports.randomId = new mongoose.Types.ObjectId().toHexString();

module.exports.validClient = {
  name: 'validClient',
  logo: 'validClient logo',
};

module.exports.invalidClient = {
  name: 1,
  logo: 'validClient logo',
};

module.exports.validClientWithProject = {
  name: 'validClient with project',
  logo: 'validClient witn project logo',
  projects: [
    {
      name: 'Project 1 - validClient',
      description: 'Project 1 description',
      size: 'size of project 1',
    },
    {
      name: 'Project 2 - validClient',
      description: 'Project 2 description',
      size: 'size of project 2',
    },
  ],
};

module.exports.validProject = {
  name: 'Valid Project',
  description: 'Valid Project description',
  size: 'size of valid project',
};
