const timerController = require('../controller/ctrTimer');
const { Timer, mongoose } = require('../schemas/schema');
const cron = require('node-cron');

// module.exports = function (io) {
//   const timerSpace = io.of('/stopwatch'); //timer 네임스페이스 지정
//   timerSpace.on('connection', async socket => {
//     console.log('소켓 아이디는?', socket.id);
//     console.log('userId::', socket.handshake.auth.userId);
//     console.log('client is connected in stopwatch!', socket.id);
//     const userId = socket.handshake.auth.userId;
//     socket.on('start', async data => {
//       console.log('start event!!', data);
//       await timerController.updateStopWatch(data, userId);
//     });
//     socket.on('pause', async data => {
//       console.log('pause_event!!', data);
//       await timerController.updateStopWatch(data, userId);
//     });
//     cron.schedule('0 10 * * *', () => {
//       timerSpace.emit('On the hour');
//       console.log('서버::정각이다!');
//     });
//   });
// };
module.exports = function (socket, userId, groupId, nickObjs, groupSpace) {
  console.log(userId, groupId, nickObjs, 'timer module!!');
  socket.on('setTimer', async data => {
    try {
      console.log('setTimer!!!');

      const updateUserTimer = await timerController.updateStopWatch(data, userId);
      console.log(updateUserTimer, '업데이트된 유저 타이머!!');
      // Update totalTime and isRunning for the specific user
      if (!nickObjs[groupId]) return;
      const newNickObjs = nickObjs[groupId].map(user => {
        if (user.userId === userId) {
          return {
            ...user,
            isRunning: updateUserTimer.is_running,
            totalTime: updateUserTimer.total_time,
            startTime: updateUserTimer.start_time,
          };
        }
        return user;
      });
      nickObjs[groupId] = newNickObjs;

      groupSpace.to(groupId).emit('updateUser', nickObjs[groupId]);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('initTimer', async data => {
    try {
      console.log('initTimer!!!');

      const updateUserTimer = await timerController.updateStopWatch(data, userId);
      console.log(updateUserTimer, '업데이트된 유저 타이머!!');
      // Update totalTime and isRunning for the specific user
      if (!nickObjs[groupId]) return;
      const newNickObjs = nickObjs[groupId].map(user => {
        if (user.userId === userId) {
          let totalTime;

          if (updateUserTimer.is_running === 'y') {
            totalTime = updateUserTimer.total_time + (+new Date() - +updateUserTimer.start_time) / 1000;
          } else {
            totalTime = updateUserTimer.total_time;
          }

          return {
            ...user,
            isRunning: updateUserTimer.is_running,
            totalTime: totalTime,
            startTime: updateUserTimer.start_time,
          };
        }
        return user;
      });
      nickObjs[groupId] = newNickObjs;

      groupSpace.to(groupId).emit('updateUser', nickObjs[groupId]);
    } catch (err) {
      console.log(err);
    }
  });
};
