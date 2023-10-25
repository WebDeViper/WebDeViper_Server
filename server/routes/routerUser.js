const express = require('express');
const router = express.Router();
const ctrUser = require('../controllers/ctrUser');

// 유저생성
// api/user
router.post('/', ctrUser.userCreate);

// 로그인
// api/user/auth
router.post('/auth', ctrUser.tokenCreate);

module.exports = router;
