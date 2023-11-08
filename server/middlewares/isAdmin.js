// 관리자 확인
exports.isAdmin = async (req, res, next) => {
  const isAdmin = res.locals.decoded.userInfo.isServiceAdmin;

  if (isAdmin) {
    next();
  } else {
    res.status(401).send({
      msg: '관리자 권한 없음',
    });
  }
};
