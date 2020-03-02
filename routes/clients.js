const express = require('express');
const client = require('../controller/client');

const router = express.Router();

router.post('/', client.create);
router.get('/', client.getClients);
router.get('/:clientId', client.getClient);
router.post('/:clientId/project', client.addProject);
router.get('/:clientId/:projectId', client.getClientProject);
router.delete('/:clientId/:projectId', client.removeProject);
router.delete('/:clientId', client.removeClient);


module.exports = router;
