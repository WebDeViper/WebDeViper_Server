const express = require('express');
const router = express.Router();
const { REACT_APP_URL } = process.env;
const ctrUser = require('../controller/ctrUser');
const passport = require('passport');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const multer = require('multer');
const { userImgUploader } = require('../middlewares/multer/multerConfig');

// 카카오 로그인 페이지로 이동
// api/user/kakao // api/user/google 형식으로 계획
router.get('/kakao', passport.authenticate('kakao'));

// 카카오로 부터 로그인 성공여부를 응답받고 에러시 리다이렉트, 성공시 컨트롤러 호출
// api/user/kakao/callback
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    // 카카오 로그인 전략 수행 // 카카오 로그인 성공시 내부적으로 req.login()을 호출 // 따라서 콜백을 따로 실행시킬 필요없음
    session: false, // 세션 미사용
    failureRedirect: '/', // 로그인에 실패했을때 어디로 이동시킬지 적는다 // res.send로 상태코드를 보낼수도 있나?
    // failureRedirect: `${REACT_APP_URL}`, // 프론트엔드 도메인 메인으로 리다이렉트
  }),
  ctrUser.kakaoLoginTokenCreate // 다음 미들웨어(컨트롤러)
);

// 유저 삭제 (소셜 연결 해제)
// 소셜별로 연결해제 방법있긴한데 타사이트 컨셉확인해보기

// 유저 기본정보 조회
// api/user
router.get('/', ctrUser.getUser);

// 유저 정보 수정 ( nickName, category, statusMessage )
// api/user/profile
router.patch('/profile', ctrUser.patchUser);

// 유저 프로필 이미지 업로드
// api/user/profile/img
router.post(
  '/profile/img',
  userImgUploader.single('userImgFile'),
  (req, res, next) => {
    const err = req.fileValidationError; // Multer가 발생한 오류를 req.fileValidationError에 저장
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({ msg: '파일 크기가 너무 큽니다. (최대 5MB)' });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).send({ msg: '예상치 못한 파일이 업로드되었습니다.' });
      } else {
        return res.status(400).send({ msg: '파일 업로드에 실패했습니다.' });
      }
    } else if (err) {
      return res.status(400).send({ error: err.message });
    } else {
      next(); // 오류가 없음. 컨트롤러로 전달
    }
  },
  ctrUser.userProfileImgUpload
);

module.exports = router;
