// 관리자 확인
exports.isAdmin = async (req, res, next) => {
  const currentUserId = res.locals.decoded.userInfo.id;
  const userInfo = await User.findByPk(currentUserId);
  const isAdmin = userInfo.is_service_admin;

  if (isAdmin) {
    next();
  } else {
    res.status(401).send({
      msg: '관리자 권한 없음',
    });
  }
};
