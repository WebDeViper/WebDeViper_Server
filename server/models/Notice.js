const Notice = (Sequelize, DataTypes) => {
  const Notice = Sequelize.define(
    'notice',
    {
      notice_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1, // Or DataTypes.UUIDV4
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
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
