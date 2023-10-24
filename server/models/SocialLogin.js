const SocialLogin = (Sequelize, DataTypes) => {
  const SocialLogin = Sequelize.define(
    'social_login',
    {
      social_login_seq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      social_type: DataTypes.STRING,
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return SocialLogin;
};
module.exports = SocialLogin;
