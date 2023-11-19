const Notice = (Sequelize, DataTypes) => {
  const Notice = Sequelize.define(
    'notice',
    {
      notice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // INTEGER 타입의 자동 증가 설정
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT('medium'),

      },
    },
    {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );
  return Notice;
};
module.exports = Notice;
