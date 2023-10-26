const passport = require('passport');
// const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
// const google = require('');
// const naver = require('');

module.exports = () => {
  // local();
  kakao();
  // google();
  // naver();
};
