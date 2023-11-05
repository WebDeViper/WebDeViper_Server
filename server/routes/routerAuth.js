const express = require('express');
const router = express.Router();
const ctrAuth = require('../controller/ctrAuth');
const { verifyJwtToken, verifyRefreshToken } = require('../middlewares/jwt/jwt');

// 리프레시 토큰을 받아서 검증하고 액세스 토큰 재발급
router.use('/refresh', verifyRefreshToken, ctrAuth.refreshAccessToken);

// 네이버 로그인 페이지
router.use('/naver', ctrAuth.getNaverOAuth);

// 네이버 로그인 결과
router.use('/naver/callback', ctrAuth.getNaverLoginResult);

// 구글 로그인 페이지
router.use('/google', ctrAuth.getGoogleOAuth);

// 구글 로그인 결과
router.use('/google/callback', ctrAuth.getGoogleLoginResult);
