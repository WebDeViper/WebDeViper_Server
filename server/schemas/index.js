const mongoose = require('mongoose');

const { Todo, User, Group, Timer } = require('./schema');
const { MONGO_ID, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DBNAME } = process.env;
// const MONGO_URL = `mongodb+srv://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
const MONGO_URL = `mongodb+srv://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}`;

const connect = () => {
  // 개발 환경에서만 몽구스가 생성하는 쿼리내용 확인
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(MONGO_URL, {
    dbName: MONGO_DBNAME,
  });

  // 몽고디비 연결시 이벤트 리스너
  mongoose.connection.on('connected', async () => {
    console.log(`${MONGO_HOST} 몽고디비 연결되었습니다.`);
  });
  // 데이터 강제로 입력

  // newUser.save();
  // const newUser = new User({
  //   user_category_name: '공무원',
  //   nick_name: '태일이',
  // });
  // newUser.save();
  // const todoDocument = new Todo({
  //   user_id: '6544d9eeaabd61b4d1cf4bc5', // 실제 User ObjectId로 대체
  //   title: '밥먹기',
  //   content: 'Milk, eggs, and bread',
  //   start_time: new Date('2023-11-05T10:00:00Z'), // 시작 시간 설정 (실제 값으로 변경)
  //   end_time: new Date('2023-11-05T12:00:00Z'), // 종료 시간 설정 (실제 값으로 변경)
  //   done: false,
  // });
  // todoDocument.save();

  // 몽고 연결시 에러발생 이벤트 리스너
  const dummyData = [
    {
      user_id: '1',
      total_time: 3600, // 1 hour
      is_running: 'n',
      daily: {
        date: new Date(), // current date
        data: [
          {
            title: 'Math',
            timer: 1800, // 30 minutes
          },
          {
            title: 'History',
            timer: 1800, // 30 minutes
          },
        ],
      },
    },
    {
      user_id: '2',
      total_time: 7200, // 2 hours
      is_running: 'y',
      daily: {
        date: new Date(), // current date
        data: [
          {
            title: 'Science',
            timer: 3600, // 1 hour
          },
          {
            title: 'English',
            timer: 3600, // 1 hour
          },
        ],
      },
    },
    // Add more dummy data as needed
  ];

  // Assuming Timer is your Mongoose model
  Timer.insertMany(dummyData)
    .then(result => {
      console.log('Documents inserted successfully:', result);
    })
    .catch(err => {
      console.error(err);
    });

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
