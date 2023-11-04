const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// 토큰 검증 미들웨어
// 요청 헤더에서 토큰값을 확인 한후 비밀키로 검증한다.
exports.verifyJwtToken = (req, res, next) => {
  try {
    // console.log(req.headers.authorization);
    // res.locals 에 저장한 내용은 다음 미들웨어로 전달된다.
    // verify(요청헤더에 저장된 토큰 , 비밀키)
    res.locals.decoded = jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET);

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

// exports.setReqJwt = (req, res, next) => {
//   // 요청 헤더에서 jwt 토큰을 꺼내 저장 (검증하지 않음)
//   // res.locals 에 저장한 내용은 다음 미들웨어로 전달된다.
//   res.locals.receivedToken = req.headers.authorization;
//   console.log(res.locals.receivedToken);
//   return next();
// };
