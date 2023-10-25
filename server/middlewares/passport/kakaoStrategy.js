const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../../models');
const { KAKAO_ID, KAKAO_CLIENT_SECRET } = process.env;

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: KAKAO_ID, // 백엔드 도메인이 바뀔때마다 키를 다시 받아야됌
        clientSecret: KAKAO_CLIENT_SECRET,
        callbackURL: '/api/user/kakao/callback', // 카카오로부터 인증 결과를 받을 라우터 주소
        // 카카오에서는 인증 결과와 함께 accessToken, refreshToken, profile 을 보낸다.
        // profile에 클라이언트의 정보가 있음
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const exUser = await User.findOne({
            where: { sns_id: profile.id, provider: 'kakao' }, // 가입이 됐는지 판단하는 기준
          });

          if (exUser) {
            // 로그인 성공 처리 다음미들웨어로 유저정보를 보낸다
            done(null, exUser);
          } else {
            // 가입이력이 없으니 회원가입 처리 후 가입한유저정보를 다음 미들웨어로 전달
            const newUser = await User.create({
              email: profile._json?.kakao_account?.email, // profile.email이 undefined 일수도 있음. 중간에 어떤 속성이 존재하지 않는 경우에도 코드는 오류를 발생시키지 않고 undefined를 반환
              // nick: profile.displayName,
              sns_id: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err); // 이거 어디에서 수행하는지 찾아서 에러처리 하기
        }
      }
    )
  );
};
