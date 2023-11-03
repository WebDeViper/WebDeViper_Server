const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerNotice = require('./routerNotice');
const routerTodo = require('./routerTodo');
const groupRouter = require('./routerGroup');

// api/group
router.use('/api/group', groupRouter);

router.use('/api', routerTodo);

// 유저 라우터
router.use('/api/user', routerUser);

router.use('/api', routerNotice);

// 공지사항 라우터

// 테스트 페이지 렌더링
router.use('/test', (req, res) => {
  res.render('index');
});

module.exports = router;
