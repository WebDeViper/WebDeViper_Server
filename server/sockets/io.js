const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const { User, Group, Room, mongoose } = require('../schemas/schema');
const chatModule = require('./chat');
const timerModule = require('./timer');
module.exports = function (io) {
  //group(chat, timer) namespace
  const groupSpace = io.of('/chat');
  let name; // 사용자의 이름을 저장하는 변수
  const nickObjs = {}; //{socket.id:nick1,socket.id:nick2}
  const webRTCObjs = {};

  // function updateList() {
  //   io.emit('updateNicks', nickObjs); // 전체 사용자 닉네임 모음 객체 전달
  // }
  groupSpace.on('connection', async socket => {
    console.log('사용자 소켓 연결하였씁니다.---------------', socket.id);
    const userId = socket.handshake.auth.userId;
    const groupId = socket.handshake.auth.groupId;
    const userNickName = socket.handshake.auth.userNickName;

    // // webRTC
    // socket.on('join-zoom', cb => {
    //   // console.log('>>>>>joinZoomjoinZoom', data);
    //   console.log(cb);
    //   // socket.join(groupId);
    //   // socket.broadcast.to(groupId).emit('user-connected', userId);
    // });

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
            nickObjs[groupId].push({
              userId: userId,
              userNickName: userNickName,
              userProfile: user.image_path,
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

    timerModule(socket, userId, groupId);

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
