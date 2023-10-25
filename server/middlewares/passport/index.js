const passport = require('passport');
// const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
// const { User } = require('../models');

module.exports = () => {
  //   // passport.serializeUser 는 로그인시 실행되며, req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
  //   passport.serializeUser((user, done) => {
  //     // user는 유저의id 뿐아니라 정보를 포함한 객체
  //     console.log('@@@@@@@@@@@@@', 'serializeUser 실행');
  //     done(null, user.id); // 첫번째 인수는 에러가 발생할때 사용하는 것, 두번째 인수는 세션에 저장해줄 유저의 아이디
  //     // done은 결과를 passport에게 알리는 역할
  //   });

  //   // 각요청마다 실행됩니다. passport.session 미들웨어가 이 메서드를 호출합니다.
  //   // serializeUser 내부 done이 인수로 받은 user.id를 여기서 인수로 받습니다(id). 그리고 id로 데이터베이스에서 사용자 정보를 조회합니다.
  //   // 그리고 조회한 정보를 req.user에 저장합니다.
  //   passport.deserializeUser((id, done) => {
  //     console.log('>>>>>>>>>>>>>>', 'deserializeUser 실행');
  //     User.findOne({ where: { id } }) // db의 필드명이 id 이기 때문에 이런식으로 작성 가능함 //  where { idField : id }
  //       .then(user => done(null, user)) // 여기서 user는 id 필드로 검색한 로우 전체
  //       .catch(err => done(err));
  //   });

  //   local();
  kakao();
  console.log('!!!!!!!!!');
};
