const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerNotice = require('./routerNotice');
const routerTodo = require('./routerTodo');
const groupRouter = require('./routerGroup');

// (스터디)그룹 라우터
router.use('/api/group', groupRouter);

// Todo 라우터
router.use('/api', routerTodo);

// 유저 라우터
router.use('/api/user', routerUser);

// 공지사항 라우터
router.use('/api', routerNotice);

// 네이버 & 구글 로그인
// 인증 라우터(토큰발급/재발급.. refreshToken)
router.use('/api/auth', routerUser);

// 테스트 페이지 렌더링
// router.use('/test', (req, res) => {
//   res.render('index');
// });

module.exports = router;
