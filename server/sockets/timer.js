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
module.exports = function (socket, userId, groupId) {
  console.log(userId, groupId, 'timer module!!');
  socket.on('setTimer', async data => {
    try {
      console.log('setTimer!!!');
      const groupTimer = await timerController.getGroupTimer(groupId);
      console.log(groupTimer, ':::');
      socket.emit('getTimer', groupTimer);
    } catch (err) {
      console.log(err);
    }
  });
};
