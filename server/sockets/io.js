const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const timerController = require('../controller/ctrTimer');
const { User, Group, Room, mongoose } = require('../schemas/schema');
const chatModule = require('./chat');
const timerModule = require('./timer');
module.exports = function (io) {
  const groupSpace = io.of('/chat');

  const nickObjs = {};

  groupSpace.on('connection', async socket => {
    console.log('사용자 소켓 연결하였씁니다.---------------', socket.id);
    const userId = socket.handshake.auth.userId;
    const groupId = socket.handshake.auth.groupId;
    const userNickName = socket.handshake.auth.userNickName;

    chatModule(socket, userController, groupId, userNickName);
    socket.on('joinRoom', async () => {
      try {
        const user = await userController.checkUser(userNickName);
        const isMember = await userController.joinRoom(groupId, user);
        if (!isMember) {
          cb({ isOk: false, msg: '해당 그룹의 멤버가 아닙니다.' });
        } else {
          socket.join(groupId);
          if (!nickObjs[groupId]) {
            nickObjs[groupId] = []; // 배열이 없으면 초기화
          }
          // 소켓 ID가 이미 존재하는지 확인
          const existingUserIndex = nickObjs[groupId].findIndex(data => data.userId === userId);
          if (existingUserIndex === -1) {
            // 존재하지 않으면 새 항목 추가
            //이 경우 user의 타이머도 함께 불러온다
            const userTimerInfo = await timerController.getUserTimer(userId);
            // const userTimerInfo = await timerController.updateStopWatch(
            //   { subject: '수학', time: 70, is_running: 'y' },
            //   userId
            // );
            console.log('유저의 타이머 인포!!', userTimerInfo);
            nickObjs[groupId].push({
              userId: userId,
              userNickName: userNickName,
              userProfile: user.image_path,
              totalTime: userTimerInfo.total_time,
              isRunning: userTimerInfo.is_running,
            });
          }
          groupSpace.to(groupId).emit('getUsers', nickObjs[groupId]);
          // socket.broadcast.to(groupId).emit('user-connected', userId);
        }
        // socket.broadcast.emit('user-connected', userId);
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });
    socket.on('zoomJoin', peerId => {
      socket.broadcast.emit('user-connected', peerId);
    });

    timerModule(socket, userId, groupId, nickObjs, groupSpace);

    // console.log(nickObjs, 'nickObjs2');

    // 사용자가 연결을 해제하는 것을 처리합니다.
    socket.on('disconnect', async () => {
      const user = await userController.deleteUser(socket.id);
      // 유저가 떠날 때 nickObjs 값에서 삭제
      const arrayToRemoveFrom = nickObjs[groupId];
      if (arrayToRemoveFrom && arrayToRemoveFrom.length > 0) {
        const updatedArray = arrayToRemoveFrom.filter(item => item.userId !== userId);
        nickObjs[groupId] = updatedArray;
        groupSpace.to(groupId).emit('leaveRoom', nickObjs[groupId]);
      }
      console.log('사용자가 소켓 연결을 해제했습니다');
    });
  });
};
