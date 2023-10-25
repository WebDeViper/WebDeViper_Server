const mongoose = require('mongoose');

const connect = () => {
  // 개발 환경에서만 몽구스가 생성하는 쿼리내용 확인
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(
    'mongodb://root:1234@localhost:27017/admin', // 접속을 시도하는 데이터베이스가 admin임
    {
      dbName: 'tenzoom', // 실제로 사용할 데이터베이스이름
      useNewUrlParser: true, // 별 의미 없음
    }
  );

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
