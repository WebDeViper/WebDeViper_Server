const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerAuth = require('./routerAuth');
const routerNotice = require('./routerNotice');
const routerTodo = require('./routerTodo');
const routerCategory = require('./routerCategory');
const groupRouter = require('./routerGroup');
// const routerTimer = require('./routerTimer');
const routerNotification = require('./routerNotification');
// (스터디)그룹 라우터
router.use('/api/group', groupRouter);

// Todo 라우터
router.use('/api', routerTodo);

// 공지사항 라우터
router.use('/api', routerNotice);

//타이머 라우터
// router.use('/api', routerTimer);

// 유저 라우터
router.use('/api/user', routerUser);

// 네이버 & 구글 로그인 // 인증 라우터(토큰발급/재발급.. refreshToken)
router.use('/api/auth', routerAuth);

// 랭킹 라우터
router.use('/api', routerCategory);

//알림 라우터
router.use('/api', routerNotification);

module.exports = router;
