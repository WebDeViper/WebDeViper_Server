const express = require('express');
const router = express.Router();
const ctrCategory = require('../controller/ctrCategoryRank');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, REFRESH_SECRET } = process.env;

// 현재 유저의 카테고리에서 랭킹 조회
router.get('/ranking', (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET);
    res.locals.decoded = decoded;

    // verifyJwtToken 함수 호출 후 콜백 함수 실행
    verifyJwtToken(req, res, () => {
      // 토큰이 유효한 경우
      console.log('Verifying JWT token...');

      // getMyCategoryRank 함수 실행
      ctrCategory.getMyCategoryRank(req, res);
    });
  } catch (err) {
    // 에러 처리 또는 토큰이 없는 경우
    console.error('Error verifying JWT token:', err);

    // getCategoryRank 함수 실행
    ctrCategory.getCategoryRank(req, res);
  }
});

module.exports = router;
