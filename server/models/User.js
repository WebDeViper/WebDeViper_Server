const User = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Or DataTypes.UUIDV1 (1은 시간 순서의 의존, 4는 무작위라고 함)
      },
      email: {
        type: DataTypes.STRING,
      },
      nick_name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      status_message: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      sns_id: {
        type: DataTypes.STRING,
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: 'local',
      },
      is_admin: {
        type: DataTypes.CHAR(1),
        defaultValue: 'n', //'n':관리자 아님, 'y':관리자임
      },
      category: {
        type: DataTypes.STRING,
        defaultValue: '기타',
      },
      image_path: {
        type: DataTypes.STRING,
        defaultValue: '/api/static/profileImg/defaultProfile.jpeg',
      },
      password: DataTypes.STRING,
      socket_id: { type: DataTypes.STRING, defaultValue: null },
    },
    {
      underscored: true, // 스네이크 케이스
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );

  return User;
};
module.exports = User;
