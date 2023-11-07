const mongoose = require('mongoose');

const { Todo, User, Group, Timer } = require('./schema');
const { MONGO_ID, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DBNAME } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

// const MONGO_URL = `mongodb://localhost:27017`;

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
    // const createDummyData = async () => {
    //   const today = new Date();

    //   // 현재 날짜에서 1일(24시간)을 빼서 어제 날짜를 얻습니다.
    //   const yesterday = new Date(today);
    //   yesterday.setDate(today.getDate() - 1);
    //   // 더미 사용자 생성
    //   for (let i = 1; i <= 10; i++) {
    //     const user = new User({
    //       user_category_name: '초등학생',
    //       nick_name: `User${i}`,
    //       // 나머지 사용자 정보도 채우기
    //     });
    //     await user.save();
    //   }

    //   // 더미 그룹 데이터 생성
    //   for (let i = 1; i <= 10; i++) {
    //     const groupLeader = await User.findOne({ nick_name: `User${i}` }); // 그룹장 지정
    //     const groupMembers = [groupLeader._id];
    //     for (let j = 1; j <= 5; j++) {
    //       // 그룹 멤버 추가 (최대 5명)
    //       const member = await User.findOne({ nick_name: `User${((i + j) % 10) + 1}` });
    //       groupMembers.push(member._id);
    //     }

    //     const group = new Group({
    //       group_leader: groupLeader._id,
    //       group_name: `Group${i}`,
    //       group_category: '초등학생',
    //       group_description: `Group ${i} Description`,
    //       daily_goal_time: '2 hours',
    //       members: groupMembers,
    //     });
    //     await group.save();
    //   }
    //   console.log('어제는', yesterday); //2023-11-06T04:05:10.568Z
    //   // 더미 타이머 데이터 생성
    //   for (let i = 1; i <= 10; i++) {
    //     const user = await User.findOne({ nick_name: `User${i}` }); // 기존 사용자 찾기
    //     const timer = new Timer({
    //       user_id: user._id,
    //       total_time: 3100, // 초기 공부 시간은 0으로 설정
    //       daily: {
    //         date: yesterday, // 어제 날짜를 설정
    //         data: [
    //           {
    //             title: 'Study',
    //             timer: 1800, // 예: 30분
    //           },
    //           {
    //             title: 'Math',
    //             timer: 1500, // 예: 25분
    //           },
    //           // 다른 과목과 타임 추가
    //         ],
    //       },
    //     });
    //     await timer.save();
    //   }

    //   console.log('더미 데이터 생성 완료');
    // };

    createDummyData();

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
