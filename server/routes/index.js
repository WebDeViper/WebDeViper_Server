const express = require('express');
const router = express.Router();

const userRouter = require('./user_router');
const groupRouter = require('./group_router');

// api/user
router.use('/api/user', userRouter);

// api/group
router.use('/api/group', groupRouter);

module.exports = router;
