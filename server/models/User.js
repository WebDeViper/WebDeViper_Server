const User = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nick_name: DataTypes.STRING,
      password: DataTypes.STRING,
      user_profile_image_path: {
        type: DataTypes.STRING,
        defaultValue: false, // 나중에 기본이미지 경로로 변경
      },
      status_message: DataTypes.STRING,
      is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      //
      email: DataTypes.STRING,
      provider: {
        type: DataTypes.ENUM('local', 'kakao', 'google'),
      },
      sns_id: DataTypes.STRING,
      //
      //is_social_login: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return User;
};
module.exports = User;
