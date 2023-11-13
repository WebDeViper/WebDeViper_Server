const Group = (Sequelize, DataTypes) => {
  const Group = Sequelize.define(
    'group',
    {
      group_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1, // Or DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
      },
      leader_id: {
        type: DataTypes.UUID,
        references: {
          model: 'user', // User 모델의 테이블명
          key: 'user_id', // User 모델의 기본키
        },
      },
      img_path: {
        type: DataTypes.STRING,
        defaultValue: '/api/static/groupImg/defaultGroup.jpeg',
      },
      category: {
        type: DataTypes.STRING,
      },
      member_max: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
      },
      goal_time: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      underscored: true,
      freezeTableName: true, // 테이블명을 복수형으로 변환하지 않도록 설정
    }
  );
  return Group;
};
module.exports = Group;
