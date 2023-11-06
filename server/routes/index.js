const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerAuth = require('./routerAuth');
const routerNotice = require('./routerNotice');
const routerTodo = require('./routerTodo');
const routerCategory = require('./routerCategory');
const groupRouter = require('./routerGroup');

// (스터디)그룹 라우터
router.use('/api/group', groupRouter);

// Todo 라우터
router.use('/api', routerTodo);

// 공지사항 라우터
router.use('/api', routerNotice);

// 유저 라우터
router.use('/api/user', routerUser);

// 네이버 & 구글 로그인 // 인증 라우터(토큰발급/재발급.. refreshToken)
router.use('/api/auth', routerAuth);

// 랭킹 라우터
router.use('/api', routerCategory);
module.exports = router;
