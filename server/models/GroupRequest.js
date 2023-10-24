const GroupRequest = (Sequelize, DataTypes) => {
  const GroupRequest = Sequelize.define(
    'group_request',
    {
      group_request_seq: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM('approved', 'pending'),
      },
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return GroupRequest;
};
module.exports = GroupRequest;
