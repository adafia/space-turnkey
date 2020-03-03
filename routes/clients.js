const express = require('express');
const client = require('../controller/client');
const auth = require('../middleware/auth');
const { tryCatchWrap } = require('../middleware/async');

const router = express.Router();

router.post('/', auth, tryCatchWrap(client.create));
router.get('/', tryCatchWrap(client.getClients));
router.get('/:clientId', tryCatchWrap(client.getClient));
router.post('/:clientId/project', auth, tryCatchWrap(client.addProject));
router.get('/:clientId/:projectId', tryCatchWrap(client.getClientProject));
router.delete('/:clientId/:projectId', auth, tryCatchWrap(client.removeProject));
router.delete('/:clientId', auth, tryCatchWrap(client.removeClient));


module.exports = router;
