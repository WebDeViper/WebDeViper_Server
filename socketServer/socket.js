const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const connect = require('./schemas/index');

// cors 미들웨어
app.use(
  cors({
    origin:
      process.env.NODE_ENV !== 'production' ? true : ['http://13.124.233.17/group', 'https://13.124.233.17/group'],
  })
);

// 몽고 DB 연결
connect();

// 소켓 설정
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // 클라이언트 주소
  cors: {
    origin: process.env.NODE_ENV !== 'production' ? true : ['http://13.124.233.17', 'https://13.124.233.17'],
  },
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 소켓 커넥션 연결
require('./utils/io')(io); // 채팅
require('./utils/timer')(io); // 타이머

httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log('server listening on port', process.env.SOCKET_PORT);
});

// 태균) 더미데이터 잠깐 주석처리 했어
// const mongoose = require('mongoose');
// const User = mongoose.model('User'); // User 모델을 가져옵니다
// const Group = mongoose.model('Group'); // Group 모델을 가져옵니다

// // 더미 그룹 데이터 생성
// const dummyGroup1 = new Group({
//   group_name: 'Group 1 Name',
//   // 다른 그룹 필드 설정
// });

// const dummyGroup2 = new Group({
//   group_name: 'Group 2 Name',
//   // 다른 그룹 필드 설정
// });

// // 더미 그룹 데이터 저장
// Promise.all([dummyGroup1.save(), dummyGroup2.save()])
//   .then(savedGroups => {
//     console.log('Dummy groups saved:', savedGroups);

//     // 더미 유저 데이터 생성
//     const dummyUser = new User({
//       user_category_name: 'Category Name',
//       nick_name: 'User Nickname',
//       user_profile_image_path: 'Profile Image Path',
//       status_message: 'Status Message',
//       is_service_admin: true,
//       email: 'user@example.com',
//       provider: 'Provider Name',
//       sns_id: 'SNS ID',
//       groups: savedGroups.map(group => group._id), // 그룹 ID 배열 추가
//       rooms: [],
//       chat_online: true,
//       token: 'User Token',
//       pending_groups: savedGroups.map(group => ({
//         group: group._id,
//         is_approved: false,
//       })),
//     });

//     // 더미 유저 데이터 저장
//     return dummyUser.save();
//   })
//   .then(savedUser => {
//     console.log('Dummy user saved:', savedUser);
//   })
//   .catch(err => {
//     console.error('Error:', err);
//   });

module.exports = app;
