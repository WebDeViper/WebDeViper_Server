const Group = (Sequelize, DataTypes) => {
  const Group = Sequelize.define(
    'group',
    {
      group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      password: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      description: DataTypes.STRING,
      daily_goal_time: DataTypes.INTEGER,
      maximum_number_member: { type: DataTypes.INTEGER, defaultValue: 5 },
      is_camera_on: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return Group;
};
module.exports = Group;
