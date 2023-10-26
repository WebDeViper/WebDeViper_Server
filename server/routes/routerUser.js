const express = require('express');
const router = express.Router();
const { REACT_APP_URL } = process.env;
const ctrUser = require('../controller/ctrUser');
const passport = require('passport');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

// 카카오 로그인 페이지로 이동
// api/user/kakao // api/user/google 형식으로 계획
router.get('/kakao', passport.authenticate('kakao'), (err, user, info) => {
  if (err) {
    // 에러 핸들링: 카카오 로그인 전략 실행 중 에러가 발생한 경우
    console.error(err);
    return res.status(500).send({ msg: '서버 에러, 카카오 로그인 페이지로 이동 처리' });
  }
});

// 카카오로 부터 로그인 성공여부를 응답받고 에러시 리다이렉트, 성공시 컨트롤러 호출
// api/user/kakao/callback
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    // 카카오 로그인 전략 수행 // 카카오 로그인 성공시 내부적으로 req.login()을 호출 // 따라서 콜백을 따로 실행시킬 필요없음
    session: false, // 세션 미사용
    // failureRedirect: '/', // 로그인에 실패했을때 어디로 이동시킬지 적는다 // res.send로 상태코드를 보낼수도 있나?
    failureRedirect: `${REACT_APP_URL}`, // 프론트엔드 도메인 메인으로 리다이렉트
  }),
  ctrUser.kakaoLoginTokenCreate // 다음 미들웨어(컨트롤러)
);

module.exports = router;
