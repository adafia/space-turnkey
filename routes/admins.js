const express = require('express');
const admin = require('../controller/admin');
const auth = require('../middleware/auth');
const superAdmin = require('../middleware/superAdmin');
const { tryCatchWrap } = require('../middleware/async');

const router = express.Router();

router.post('/', [auth, superAdmin], tryCatchWrap(admin.create));
router.put('/', auth, tryCatchWrap(admin.update));
router.put('/super/:email', [auth, superAdmin], tryCatchWrap(admin.makeSuper));
router.get('/all', [auth, superAdmin], tryCatchWrap(admin.getAdmins));
router.post('/auth', tryCatchWrap(admin.login));
router.get('/self', auth, tryCatchWrap(admin.getAdmin));
router.delete('/:id', [auth, superAdmin], tryCatchWrap(admin.deleteAdmin));
router.delete('/self/:id', auth, tryCatchWrap(admin.deleteSelf));

module.exports = router;
