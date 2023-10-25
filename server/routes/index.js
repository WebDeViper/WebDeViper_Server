const express = require('express');
const router = express.Router();
const routerAuth = require('./routerAuth');

// api/auth
router.use('/api/auth', routerAuth);

module.exports = router;
