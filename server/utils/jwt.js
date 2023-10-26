const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';

// 유저정보 객체를 전달받아 JWT를 생성 한다.
exports.generateJwtToken = user => {
  const payload = {
    userId: user.user_id,
    snsId: user.sns_id,
  };

  // sign({토큰의 내용}, 토큰의 비밀 키, {토큰의 설정}) // issuer 는 발급자임.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m', issuer: 'APIServer' });
  // const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30m', issuer: 'APIServer' }); // 일단 전부 보냄
  return token;
};
