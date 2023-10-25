// 알람
const Alarm = (Sequelize, DataTypes) => {
  const Alarm = Sequelize.define(
    'alarm',
    {
      alarm_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },

    {
      underscored: true,
      freezeTableName: true,
    }
  );
  return Notice;
};
module.exports = Notice;
