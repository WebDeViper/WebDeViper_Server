const Todo = (Sequelize, DataTypes) => {
  const Todo = Sequelize.define(
    'todo',
    {
      todo_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1, // Or DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'user',
          key: 'user_id',
        },
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      start_time: {
        type: DataTypes.DATE,
      },
      end_time: {
        type: DataTypes.DATE,
      },
      done: {
        type: DataTypes.CHAR(1),
        defaultValue: 'n', // 'y':완료, 'n':완료되지 않음
      },
    },
    {
      underscored: true,
      freezeTableName: true,
    }
  );
  return Todo;
};
module.exports = Todo;
