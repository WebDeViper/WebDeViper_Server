const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');

// 유저 라우터
router.use('/api/user', routerUser);

module.exports = router;
