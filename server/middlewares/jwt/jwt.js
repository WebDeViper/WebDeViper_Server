const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtSecret';

// 토큰 검증 미들웨어
// 요청 헤더에서 토큰값을 확인 한후 비밀키로 검증한다.
exports.verifyJwtToken = (req, res, next) => {
  try {
    // res.locals 에 저장한 내용은 다음 미들웨어로 전달된다.
    // verify(요청헤더에 저장된 토큰 , 비밀키)
    // console.log('req.headers.authorization>>>>', req.headers.authorization);
    console.log('req.headers.cookie>>>>', req.headers.cookie); // 이건 테스트용

    res.locals.decoded = jwt.verify(req.headers.authorization, JWT_SECRET);
    // console.log('middleWare >> ', res.locals.decoded);
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
