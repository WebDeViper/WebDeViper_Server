// 시퀄라이즈 모듈 호출
const Sequelize = require('sequelize');

// .env
const { DB_ENV } = process.env;

// config.json 파일을 불러와서 DB 연결 정보를 제공
const config = require(__dirname + '/../config/config.json')[DB_ENV];
const db = {};

// config를 이용해서 시퀄라이즈 객체 설정 및 생성
let sequelize = new Sequelize(config.database, config.username, config.password, config);

const Group = require('./Group')(sequelize, Sequelize);
const GroupMember = require('./GroupMember')(sequelize, Sequelize);
const GroupRequest = require('./GroupRequest')(sequelize, Sequelize);
const SocialLogin = require('./SocialLogin')(sequelize, Sequelize);
const Timer = require('./Timer')(sequelize, Sequelize);
const User = require('./User')(sequelize, Sequelize);
const Todo = require('./Todo')(sequelize, Sequelize);
const Notice = require('./Notice')(sequelize, Sequelize);
// 모델 관계
// 한명의 유저는 여러개의 Timer를 가진다
// 사용자가 삭제되면 해당 사용자와 연결된 모든 타이머 자동 삭제 == onDelete: 'CASCADE'
User.hasMany(Timer, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Timer.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

//한명의 유저(조건:관리자)는 여러개의 NOTICE를 가진다.
User.hasMany(Notice, { foreignKey: 'is_admin', onDelete: 'CASCADE' });
Notice.belongsTo(User, { foreignKey: 'is_admin', onDelete: 'CASCADE' });

// 한명의 유저는 여러개의 소셜 로그인 방식을 가진다
User.hasMany(SocialLogin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
SocialLogin.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// 한명의 유저는 여러개의 투두를 가진다
User.hasMany(Todo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Todo.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// GroupMember테이블을 매개로
// 유저:그룹 의 다대다 관계 설정
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

// 하나의 사용자는 여러 그룹에 요청
// 유저:그룹 의 다대다 관계 설정
// 아직 승인되지 않은 요청들을 확인할때 의미있는 데이터
User.belongsToMany(Group, { through: GroupRequest }); // User.belongsToMany(Group, { through: GroupRequest, as: 'group_requester' });
Group.belongsToMany(User, { through: GroupRequest });

db.sequelize = sequelize; // DB연결정보를 가진 시퀄라이저
db.Sequelize = Sequelize; // 시퀄라이저 모듈

db.Group = Group;
db.GroupMember = GroupMember;
db.GroupRequest = GroupRequest;
db.SocialLogin = SocialLogin;
db.Timer = Timer;
db.User = User;
db.Notice = Notice;
db.Todo = Todo;
// db.Alarm = Alarm;
module.exports = db;
