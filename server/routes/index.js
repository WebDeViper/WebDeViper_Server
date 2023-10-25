const express = require('express');
const router = express.Router();
const routerUser = require('./routerUser');
const routerNotice = require('./routerNotice');

// 유저 라우터
router.use('/api/user', routerUser);

router.use('/api', routerNotice);

// 테스트 페이지 렌더링
router.use('/test', (req, res) => {
  res.render('index');
});

module.exports = router;
