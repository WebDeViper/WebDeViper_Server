const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT } = process.env;
// const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/admin`;
const MONGO_URL = `mongodb+srv://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}/admin`;
const mysql = require('mysql');
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
const User = require('../schemas/User');
// const Group = require('../schemas/Group');

const connect = () => {
  // 개발 환경에서만 몽구스가 생성하는 쿼리내용 확인
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(
    // 'mongodb://localhost:27017/minyeong',
    MONGO_URL, // 접속을 시도하는 데이터베이스가 admin임
    {
      dbName: 'min0', // 실제로 사용할 데이터베이스이름
      useNewUrlParser: true, // 별 의미 없음
    }
  );

  const connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
  });

  connection.connect(err => {
    if (err) {
      console.error('SQL DB 연결 오류:', err);
      return;
    }
    console.log('SQL DB 연결 완료');
  });

  // 테스트용 코드
  connection.query('SELECT * FROM user', (err, result) => {
    if (err) throw err;
    // console.log(result);

    const extractedValues = result.map(row => ({
      user_id: row.user_id,
      nick_name: row.nick_name,
    }));
    // console.log(extractedValues);

    extractedValues.map(async row => {
      const existingUser = await User.findOne({ 'user.user_id': row.user_id });
      // console.log(existingUser);
      if (existingUser) {
        // 이미 존재하는 사용자 업데이트
        existingUser.user.nick_name = row.nick_name;
        await existingUser.save();
        console.log('사용자가 성공적으로 업데이트되었습니다:', existingUser);
      } else {
        const newUser = new User({
          user: {
            user_id: row.user_id,
            nick_name: row.nick_name,
          },
        });
        // 사용자 저장
        await newUser.save();
        console.log('새 사용자가 성공적으로 저장되었습니다:', newUser);
      }
    });
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
