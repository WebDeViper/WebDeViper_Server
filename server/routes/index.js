const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerNotice = require('./routerNotice');
// router.use('/api/user', userRouter);
router.use('/api', routerNotice);
module.exports = router;
