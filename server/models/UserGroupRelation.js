const UserGroupRelation = (Sequelize, DataTypes) => {
  const UserGroupRelation = Sequelize.define(
    'user_group_relation',
    {
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'user',
          key: 'user_id',
        },
      },
      group_id: {
        type: DataTypes.UUID,
        references: {
          model: 'group',
          key: 'group_id',
        },
      },
      request_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0, //
      },
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return UserGroupRelation;
};
module.exports = UserGroupRelation;
