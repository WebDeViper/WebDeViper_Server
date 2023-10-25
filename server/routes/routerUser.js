const express = require('express');
const router = express.Router();
const passport = require('passport');
const ctrUser = require('../controllers/ctrUser');
const { generateJwtToken, verifyJwtToken } = require('../utils/jwt');

// 유저생성
// api/user
router.post('/', ctrUser.userCreate);

// 유저 정보 수정
// 토큰 검증 미들웨어 테스트
// api/user/:user_id
router.patch('/:user_id', verifyJwtToken, ctrUser.userPatch);

// 로그인
// api/user/auth
router.post('/auth', ctrUser.tokenCreate);

// 카카오 로그인 페이지로 이동
// api/user/auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// 카카오로 부터 로그인 성공여부를 응답받을 api
// api/user/kakao/callback
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    // 카카오 로그인 전략 수행 // 카카오 로그인 성공시 내부적으로 req.login() 을 호출해서 유저 식별값을 이경우 세션에 저장한다. (세션말고 다른것 쓰는경우는 아직모름) // 따라서 콜백을 따로 실행시킬 필요없음

    // 세션 사용안함
    session: false,
    // 로그인에 실패했을때 어디로 이동시킬지 적는다
    failureRedirect: '/', // res.send로 상태코드를 보낼수도 있나?
  }),
  // 다음 미들웨어
  (req, res) => {
    // 로그인에 성공했을때
    // res.redirect('/');
    const user = req.user;

    // 사용자 정보를 사용하여 JWT 토큰 생성
    const jwtToken = generateJwtToken(user);

    // JWT 토큰을 클라이언트에게 반환
    res.cookie('jwtCookie', jwtToken, {
      maxAge: 30 * 60000, // 30m
      httpOnly: true,
    });
    res.send({ token: jwtToken });
  }
);

module.exports = router;
