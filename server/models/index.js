// 시퀄라이즈 모듈 호출
const Sequelize = require('sequelize');

// .env
const { DB_ENV } = process.env;

// config.json 파일을 불러와서 DB 연결 정보를 제공
const config = require(__dirname + '/../config/config.json')[DB_ENV];
const db = {};

// config를 이용해서 시퀄라이즈 객체 설정 및 생성
let sequelize = new Sequelize(config.database, config.username, config.password, config);
const User = require('./User')(sequelize, Sequelize);
const Group = require('./Group')(sequelize, Sequelize);
const UserGroupRelation = require('./UserGroupRelation')(sequelize, Sequelize);
const Todo = require('./Todo')(sequelize, Sequelize);
const Notice = require('./Notice')(sequelize, Sequelize);

// 모델 관계
// User 모델과 Group 모델 간의 다대다 관계 설정
User.belongsToMany(Group, { through: UserGroupRelation, foreignKey: 'user_id' });
Group.belongsToMany(User, { through: UserGroupRelation, foreignKey: 'group_id' });

// UserGroupRelation 테이블에 User 모델과 Group 모델 간의 외래 키 설정
UserGroupRelation.belongsTo(User, { foreignKey: 'user_id' });
UserGroupRelation.belongsTo(Group, { foreignKey: 'group_id' });

// Group 모델에 추가
Group.hasMany(UserGroupRelation, { foreignKey: 'group_id', onDelete: 'CASCADE' });
// UserGroupRelation 모델에 추가
UserGroupRelation.belongsTo(Group, { foreignKey: 'group_id', onDelete: 'CASCADE' });

// 한명의 유저는 여러개의 Timer를 가진다
// 사용자가 삭제되면 해당 사용자와 연결된 모든 타이머 자동 삭제 == onDelete: 'CASCADE'
// User.hasMany(Timer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Timer.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

//한명의 유저(조건:관리자)는 여러개의 NOTICE를 가진다.
// User.hasMany(Notice, { foreignKey: 'manager', onDelete: 'CASCADE' });
// Notice.belongsTo(Notice, { foreignKey: 'manager', onDelete: 'CASCADE' });

// 한명의 유저는 여러개의 소셜 로그인 방식을 가진다
// User.hasMany(SocialLogin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// SocialLogin.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// 한명의 유저는 여러개의 투두를 가진다
// User.hasMany(Todo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
// Todo.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// GroupMember테이블을 매개로
// 유저:그룹 의 다대다 관계 설정
// User.associate = function () {
//   User.belongsToMany(Group, {
//     through: GroupMember,
//     foreignKey: 'user_id',
//   });
// };
// Group.associate = function () {
//   Group.belongsToMany(User, {
//     through: GroupMember,
//     foreignKey: 'group_id',
//   });
// };
// GroupMember.associate = function () {
//   GroupMember.belongsToMany(User, {
//     foreignKey: 'user_id',
//   });
//   GroupMember.belongsToMany(Group, {
//     foreignKey: 'group_id',
//   });
// };
// User.belongsToMany(Group, { through: GroupMember });
// Group.belongsToMany(User, { through: GroupMember });

// 하나의 사용자는 여러 그룹에 요청
// 유저:그룹 의 다대다 관계 설정
// 아직 승인되지 않은 요청들을 확인할때 의미있는 데이터
// User.belongsToMany(Group, { through: GroupRequest }); // User.belongsToMany(Group, { through: GroupRequest, as: 'group_requester' });
// Group.belongsToMany(User, { through: GroupRequest });

db.sequelize = sequelize; // DB연결정보를 가진 시퀄라이저
db.Sequelize = Sequelize; // 시퀄라이저 모듈

db.User = User;
db.Group = Group;
db.UserGroupRelation = UserGroupRelation;
db.Notice = Notice;
db.Todo = Todo;

module.exports = db;
