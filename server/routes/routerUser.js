const express = require('express');
const router = express.Router();
const multer = require('multer');
const { userImgUploader } = require('../middlewares/multer/multerConfig');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const controllerUser = require('../controller/ctrUser');

// 유저 기본정보 조회(본인)
// api/user
// router.get('/', controllerUser.getUser);
router.get('/', verifyJwtToken, controllerUser.getUser);

// 소셜유저 로그인 and 회원가입 시키고 로그인
// /api/user/join
router.post('/join', controllerUser.join);

// local 회원가입
// /api/user/register
router.post('/register', controllerUser.registerUser);

// local 로그인
// /api/user/login
router.get('/login', controllerUser.login);

// 유저 정보 수정 ( nickName, category, statusMessage )
// 유저정보 수정하면 다시 토큰생성해서 보냄
// api/user/profile
router.patch('/profile', verifyJwtToken, controllerUser.patchUser);
// router.patch('/profile', controllerUser.patchUser);

// 유저 닉네임 중복 체크
// api/user/nick/:nick/duplicateCheck
router.get('/nick/:nickName/duplicateCheck', verifyJwtToken, controllerUser.userNickDuplicateCheck);

// 로컬 유저 이메일 중복 체크(회원가입시)
// api/user/email/:email/duplicateCheck
router.get('/email/:email/duplicateCheck', verifyJwtToken, controllerUser.emailDuplicateCheck);

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
  controllerUser.userProfileImgUpload
);

// 받은 유저아이디로 유저정보를 반환하는 API
// api/user/:userId
router.get('/:userId', verifyJwtToken, controllerUser.getUserInfo);

module.exports = router;
