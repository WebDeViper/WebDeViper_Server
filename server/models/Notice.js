// 공지
const Notice = (Sequelize, DataTypes) => {
  const Notice = Sequelize.define(
    'notice',
    {
      notice_id: {
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
