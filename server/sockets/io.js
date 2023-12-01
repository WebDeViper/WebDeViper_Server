const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const { User, Group, Room, mongoose } = require('../schemas/schema');
const chatModule = require('./chat');
const timerModule = require('./timer');
module.exports = function (io) {
  //group(chat, timer) namespace
  const groupSpace = io.of('/chat');
  let name; // 사용자의 이름을 저장하는 변수
  const nickObjs = {}; //{socket.id:nick1,socket.id:nick2}

  function updateList() {
    io.emit('updateNicks', nickObjs); // 전체 사용자 닉네임 모음 객체 전달
  }
  groupSpace.on('connection', async socket => {
    console.log('client is connected in chat!!', socket.id);
    const userId = socket.handshake.auth.userId;
    const groupId = socket.handshake.auth.groupId;
    console.log('>>>>>', userId, groupId);
    const chatModuleInstance = chatModule(socket, userController, nickObjs, updateList);

    socket.on('joinRoom', async (joinUser, rid, cb) => {
      try {
        const user = await userController.checkUser(joinUser);

        const isMember = await userController.joinRoom(rid, user);
        if (!isMember) {
          cb({ isOk: false, msg: '해당 그룹의 멤버가 아닙니다.' });
        } else {
          socket.join(rid.toString());
          if (!nickObjs[rid]) {
            nickObjs[rid] = []; // 배열이 없으면 초기화
          }

          // 소켓 ID가 이미 존재하는지 확인
          const existingUserIndex = nickObjs[rid].findIndex(data => data.userId === user.user_id);

          if (existingUserIndex === -1) {
            // 존재하지 않으면 새 항목 추가
            nickObjs[rid].push({
              userId: user.user_id,
              nickName: joinUser,
              userProfile: user.image_path,
            });
          }
          // 소켓 ID에 해당하는 nickName을 업데이트하고 싶다면 아래 부분이 필요
          // else {
          //   // If present, update the existing entry
          //   nickObjs[rid][existingUserIndex].nickName = joinUser;
          // }

          chatModuleInstance.handleJoinRoom(joinUser, rid, cb);
          groupSpace.to(rid).emit('getUsers', nickObjs[rid]);
          console.log(user, 'nickObjsnickObjs');
        }

        // const welcomeMessage = {
        //   chat: `${user.nick_name}님이 입장하셨습니다.`,
        //   user: { id: null, name: 'system' },
        // };
        // console.log('환영', welcomeMessage);
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    timerModule(socket);
    // 사용자가 채팅방을 나가는 것을 처리합니다.
    socket.on('leaveRoom', async (name, rid, userId) => {
      try {
        const user = await userController.checkUser(name);
        const arrayToRemoveFrom = nickObjs[rid];
        const updatedArray = arrayToRemoveFrom.filter(item => item.userId !== userId);
        nickObjs[rid] = updatedArray;
        chatSpace.to(rid).emit('getUsers', nickObjs[rid]);
        socket.leave(rid.toString());
        // cb({ isOk: true });
      } catch (error) {
        // cb({ isOk: false, message: error.message });
      }
    });

    // 채팅 메시지를 보내는 것을 처리합니다.
    // socket.on('sendMessage', async (rid, name, receivedMessage, cb) => {
    //   try {
    //     console.log('rid는', rid);
    //     const user = await userController.checkUser(name);
    //     let receiver;
    //     if (user) {
    //       const message = await userController.saveChat(rid, receiver, receivedMessage, user);
    //       chatSpace.to(rid.toString()).emit('message', message);

    //       return cb({ isOk: true });
    //     }
    //   } catch (error) {
    //     cb({ isOk: false, error: error.message });
    //   }
    // });

    // 사용자가 연결을 해제하는 것을 처리합니다.
    socket.on('disconnect', async () => {
      const user = await userController.deleteUser(socket.id);
      console.log('사용자가 소켓 연결을 해제했습니다');
    });
  });
};
