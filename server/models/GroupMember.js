// GroupMember 모델 (다대다 관계)
const GroupMember = (Sequelize, DataTypes) => {
  const GroupMember = Sequelize.define(
    'group_member',
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      is_admin: DataTypes.BOOLEAN,

      // group_rule: DataTypes.TEXT,
      // group_password: {
      //   type: DataTypes.INTEGER,
      //   defaultValue: null,
      // },
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return GroupMember;
};
module.exports = GroupMember;
