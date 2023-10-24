const Category = (Sequelize, DataTypes) => {
  const Category = Sequelize.define(
    'category',
    {
      category_name: {
        type: DataTypes.ENUM('초등학생', '중학생', '고등학생', '대학생'),
        primaryKey: true,
      },
    },
    {
      underscored: true,
      freezeTableName: true,
    }
  );
  return Category;
};
module.exports = Category;
