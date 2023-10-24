const Timer = (Sequelize, DataTypes) => {
  const Timer = Sequelize.define(
    'timer',
    {
      timer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: DataTypes.DATE,
      data: DataTypes.JSON,
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return Timer;
};

module.exports = Timer;
