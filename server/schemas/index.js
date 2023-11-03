const mongoose = require('mongoose');

const { Todo, User, Group } = require('./schema');
const { MONGO_ID, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DBNAME } = process.env;
// const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
const MONGO_URL = `mongodb://localhost:27017`;

const connect = () => {
  // 개발 환경에서만 몽구스가 생성하는 쿼리내용 확인
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(MONGO_URL, {
    dbName: MONGO_DBNAME,
  });

  // 몽고디비 연결시 이벤트 리스너
  mongoose.connection.on('connected', () => {
    console.log(`${MONGO_HOST} 몽고디비 연결되었습니다.`);
  });
  // 데이터 강제로 입력

  // newUser.save();
  const newGroup = new Group({
    group_category: '공무원',
    group_name: '너 내 도도도독',
  });
  // newGroup.save();
  const todoDocument = new Todo({
    user_id: '6544d9eeaabd61b4d1cf4bc5', // 실제 User ObjectId로 대체
    title: '밥먹기',
    content: 'Milk, eggs, and bread',
    start_time: new Date('2023-11-05T10:00:00Z'), // 시작 시간 설정 (실제 값으로 변경)
    end_time: new Date('2023-11-05T12:00:00Z'), // 종료 시간 설정 (실제 값으로 변경)
    done: false,
  });
  todoDocument.save();

  // 몽고 연결시 에러발생 이벤트 리스너
  mongoose.connection.on('error', error => {
    console.error('몽고디비 연결 에러', error);
  });

  // 몽고 연결 종료시 이벤트 리스너
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 재연결 시도');
    connect();
  });
};

module.exports = connect;
