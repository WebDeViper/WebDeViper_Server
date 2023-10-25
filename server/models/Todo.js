const Todo = (Sequelize, DataTypes) => {
  const Todo = Sequelize.define(
    'todo',
    {
      todo_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
    },
    {
      underscored: true,
      freezeTableName: true,
    }
  );
  return Todo;
};
module.exports = Todo;
