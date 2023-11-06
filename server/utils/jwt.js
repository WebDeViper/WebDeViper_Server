const jwt = require('jsonwebtoken');
const { JWT_SECRET, REFRESH_TOKEN_SECRET } = process.env;

// 유저정보 객체를 전달받아 JWT를 생성 한다.
exports.generateJwtToken = userInfo => {
  const payload = {
    userInfo,
  };

  // sign({토큰의 내용}, 토큰의 비밀 키, {토큰의 설정}) // issuer 는 발급자임.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m', issuer: 'APIServer' });
  return token;
};

// 유저 아이디를 받아 리프레시 토큰을 생성
exports.generateRefreshToken = userId => {
  // 리프레시 토큰을 생성
  const payload = {
    userInfo: { userId },
  };

  // sign({토큰의 내용}, 토큰의 비밀 키, {토큰의 설정}) // issuer 는 발급자임.
  const token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '12h', issuer: 'APIServer' });
  return token;
};
