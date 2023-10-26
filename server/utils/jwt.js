const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';

// 유저정보 객체를 전달받아 JWT를 생성 한다.
exports.generateJwtToken = user => {
  // console.log('@@@@@@@@@>>>', user);
  const payload = {
    userInfo: user, // 우선 유저정보 전부 토큰으로 보내지만 개인정보는 최대한 빼는식으로 사용할 것
    // userId: user.user_id,
    // userProfileImagePath: user.user_profile_image_path,
    // nickName: user.nick_name,
  };

  // sign({토큰의 내용}, 토큰의 비밀 키, {토큰의 설정}) // issuer 는 발급자임.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m', issuer: 'APIServer' });
  return token;
};
