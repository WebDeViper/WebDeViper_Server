const User = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_category_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      nick_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      password: DataTypes.STRING,
      user_profile_image_path: {
        type: DataTypes.STRING,
        defaultValue: '/static/profileImg/defaultProfile.jpeg', // 나중에 기본이미지 경로로 변경
      },
      status_message: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      is_service_admin: {
        // 우리 서비스 자체의 관리자 계정
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
