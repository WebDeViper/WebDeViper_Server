const express = require('express');
const router = express.Router();
const ctrAuth = require('../controller/ctrAuth');
const { verifyJwtToken, verifyRefreshToken } = require('../middlewares/jwt/jwt');

// 리프레시 토큰을 받아서 검증하고 액세스 토큰 재발급
router.use('/refresh', verifyRefreshToken, ctrAuth.refreshAccessToken);

// 프론트한테 요청받고 네이버 유저정보 가져와서 프론트로 전달
// 네이버는 프론트에서 처리하면 CORS떠서 어쩔수 없이 만듬
router.use('/naver/token', ctrAuth.passToken);

module.exports = router;
