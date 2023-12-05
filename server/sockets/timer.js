const timerController = require('../controller/ctrTimer');
const { Timer, mongoose } = require('../schemas/schema');

module.exports = function (socket, userId, groupId, nickObjs, groupSpace) {
  console.log(userId, groupId, nickObjs, 'timer module!!');
  socket.on('setTimer', async data => {
    try {
      console.log('setTimer!!!');
      const updateUserTimer = await timerController.updateStopWatch(data, userId);
      console.log(updateUserTimer, '업데이트된 유저 타이머!!');

      if (!nickObjs[groupId]) return;
      const newNickObjs = nickObjs[groupId].map(user => {
        if (user.userId === userId) {
          return { ...user, isRunning: updateUserTimer.is_running, totalTime: updateUserTimer.total_time };
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
