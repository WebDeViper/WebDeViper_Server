const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');

router.use('/api/user', userRouter);

module.exports = router;
