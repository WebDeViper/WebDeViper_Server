const express = require('express');
const router = express.Router();
const ctrUser = require('../controller/ctrUser');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const multer = require('multer');
const { userImgUploader } = require('../middlewares/multer/multerConfig');

// 유저 기본정보 조회
// api/user
router.get('/', verifyJwtToken, ctrUser.getUser);

// 카카오유저 로그인 and 회원가입 시키고 로그인
// /api/user/kakao
router.post('/kakao', ctrUser.kakaoAuth);

// 카카오유저 로그아웃 (새로운 JWT를 발급하고, 기존의 JWT를 무효화하는 방식)
// /api/user/kakao/logout
router.get('/kakao/logout', verifyJwtToken, ctrUser.kakaoLogout);

// 유저 정보 수정 ( nickName, category, statusMessage )
// api/user/profile
router.patch('/profile', verifyJwtToken, ctrUser.patchUser);

// 유저 닉네임 중복 체크
// api/user/nick/:nick/duplicateCheck
router.get('/nick/:nickName/duplicateCheck', verifyJwtToken, ctrUser.userNickDuplicateCheck);

// 유저 프로필 이미지 업로드
// api/user/profile/img
router.post(
  '/profile/img',
  verifyJwtToken,
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

// 일반 회원가입
//router.post('/local/join', ctrUser.localJoin);
// 일반 회원탈퇴
//router.delete('/local/Drop', ctrUser.localDrop);
// 일반 로그인
//router.get('/local/login', ctrUser.localAuth);
// 일반 로그아웃(비검증 JWT를 발급해서 보냄)
//router.get('/local/logout', ctrUser.localLogout);

module.exports = router;
