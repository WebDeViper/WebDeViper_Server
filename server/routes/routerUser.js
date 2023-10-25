const express = require('express');
const router = express.Router();
const ctrUser = require('../controllers/ctrUser');

// 유저생성
// api/user
router.post('/api/user', ctrUser.createUser);

module.exports = router;
