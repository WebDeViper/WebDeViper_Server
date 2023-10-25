const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';

// 유저정보 객체를 전달받아 JWT를 생성 한다.
exports.generateJwtToken = user => {
  const payload = {
    userId: user.user_id,
    snsId: user.snsId,
    // 다른 사용자 정보를 추가할 수 있습니다.
  };

  // sign({토큰의 내용}, 토큰의 비밀 키, {토큰의 설정}) // issuer 는 발급자임.
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m', issuer: 'APIServer' });
  return token;
};

// 토큰 검증 미들웨어
// 요청 헤더에서 토큰값을 확인 한후 비밀키로 검증한다.
exports.verifyJwtToken = (req, res, next) => {
  try {
    // res.locals 에 저장한 내용은 다음 미들웨어로 전달된다.
    // verify(요청헤더에 저장된 토큰 , 비밀키)
    console.log('req.headers.authorization>>>>', req.headers.authorization);

    res.locals.decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    console.log('middleWare >> ', res.locals.decoded);
    return next();
  } catch (err) {
    // 여기서 검증 실패시 처리
    if (err.name === 'TokenExpiredError') {
      return res.status(419).send({
        msg: '토큰 만료',
      });
    }
    return res.status(401).send({
      msg: '유효하지 않는 토큰',
    });
  }
};
