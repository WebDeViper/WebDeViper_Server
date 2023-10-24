const Group = (Sequelize, DataTypes) => {
  const Group = Sequelize.define(
    'group',
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      group_name: DataTypes.STRING,
      group_type: DataTypes.STRING, // 기본 그룹 또는 커스텀 그룹 구분
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return Group;
};
module.exports = Group;
