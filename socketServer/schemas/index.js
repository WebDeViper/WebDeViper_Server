const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DBNAME } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/`;
// const User = require('../schemas/User');
// const Group = require('../schemas/Group');

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

  // 에러발생 이벤트 리스너
  mongoose.connection.on('error', error => {
    console.error('몽고 연결 에러', error);
  });

  // 연결종료시 이벤트 리스너
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 재연결 시도');
    connect();
  });
};

module.exports = connect;
