const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerNotice = require('./routerNotice');
const routerTodo = require('./routerTodo');
// router.use('/api/user', userRouter);
router.use('/api', routerNotice);
router.use('/api', routerTodo);
module.exports = router;
