const Client = require('../models/client');
const { Project } = require('../models/project');
const { validateClient } = require('../helpers/validations/clientValidation');

const ClientController = {
  async create(req, res) {
    // Validate user input
    const { error } = validateClient(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if client already exist
    const found = await Client.find({ name: req.body.name });
    if (found.length !== 0) return res.status(409).send({ message: `Client with name: ${req.body.name} already exist` });

    // If user fills the project section
    const { projects } = req.body;
    if (projects) {
      if (projects.length !== 0) {
        const clientProjects = [];
        projects.forEach((project) => {
          clientProjects.push(new Project(project));
        });
        let client = new Client({
          name: req.body.name,
          logo: req.body.logo,
          projects: clientProjects,
        });
        client = await client.save();
        return res.status(201).send({
          message: 'The client and it\'s project(s) have been created successfully',
          client,
        });
      }
    }
    let client = new Client({
      name: req.body.name,
      logo: req.body.logo,
    });
    client = await client.save();
    return res.status(201).send({
      message: 'Client has been created successfully',
      client,
    });
  },

  async addProject(req, res) {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).send({ message: `client with the ID: ${clientId} does not exist or is invalid` });

    const project = new Project(req.body);
    client.projects.push(project);
    await client.save();
    return res.status(201).send({
      message: 'Client project has been added successfully',
      client,
    });
  },

  async removeProject(req, res) {
    const { clientId, projectId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).send({ message: `client with the ID: ${clientId} does not exist or is invalid` });

    const project = await client.projects.id(projectId);
    if (!project) return res.status(404).send({ message: `project with the ID: ${projectId} does not exist or is invalid` });

    await project.remove();
    await client.save();
    return res.status(200).send({
      message: 'Client project has been deleted',
      client,
    });
  },

  async getClients(req, res) {
    const clients = await Client.find().sort('name');
    return res.status(200).send({
      message: 'Clients have been fetched successfully',
      clients,
    });
  },

  async getClient(req, res) {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).send({ message: `client with the ID: ${clientId} does not exist or is invalid` });

    return res.status(200).send({
      message: 'Client has been fetched successfully',
      client,
    });
  },

  async getClientProject(req, res) {
    const { clientId, projectId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).send({ message: `client with the ID: ${clientId} does not exist or is invalid` });

    const project = await client.projects.id(projectId);
    if (!project) return res.status(404).send({ message: `project with the ID: ${projectId} does not exist or is invalid` });

    return res.status(200).send({
      message: 'Client\'s project has been fetched successfully',
      project,
    });
  },

  async removeClient(req, res) {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);
    if (!client) return res.status(404).send({ message: `client with the ID: ${clientId} does not exist or is invalid` });

    await client.remove();
    return res.status(200).send({
      message: 'Client has been deleted',
      client,
    });
  },
};

module.exports = ClientController;
