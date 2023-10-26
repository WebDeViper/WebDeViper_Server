const express = require('express');
const router = express.Router();
const ctrUser = require('../controller/ctrUser');
const passport = require('passport');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

// 토큰 검증 미들웨어 테스트(삭제예정)
// api/user/tokenVerify
router.get('/tokenVerify', verifyJwtToken, (req, res) => {
  res.send('토큰 검증 통과함');
});

// 유저생성
// api/user
router.post('/', ctrUser.userCreate);

// 유저 정보 수정
// api/user/:user_id
router.patch('/:user_id', verifyJwtToken, ctrUser.userPatch);

// 로그인
// api/user/auth
router.post('/auth', ctrUser.tokenCreate);

// 카카오 로그인 페이지로 이동
// api/user/kakao
router.get('/kakao', passport.authenticate('kakao'));

// 카카오로 부터 로그인 성공여부를 응답받을 api
// api/user/kakao/callback
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    session: false,
    // 카카오 로그인 전략 수행 // 카카오 로그인 성공시 내부적으로 req.login()을 호출 // 따라서 콜백을 따로 실행시킬 필요없음
    failureRedirect: '/', // 로그인에 실패했을때 어디로 이동시킬지 적는다 // res.send로 상태코드를 보낼수도 있나?
  }),
  ctrUser.kakaoLoginTokenCreate // 다음 미들웨어(컨트롤러)
);

module.exports = router;
