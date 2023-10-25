const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerNotice = require('./routerNotice');

// 유저 라우터
router.use('/api/user', routerUser);

router.use('/api', routerNotice);

module.exports = router;