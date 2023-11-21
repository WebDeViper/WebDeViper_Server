const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const { User, Group, Room, mongoose } = require('../schemas/schema');

module.exports = function (io) {
  const chatSpace = io.of('/chat');
  let name; // 사용자의 이름을 저장하는 변수
  function updateList() {
    io.emit('updateNicks', nickObjs); // 전체 사용자 닉네임 모음 객체 전달
  }
  chatSpace.on('connection', async socket => {
    console.log('client is connected', socket.id);
    // 사용자 로그인을 처리합니다.
    // socket.on('login', async (userName, cb) => {
    //   try {
    //     name = userName;
    //     const user = await userController.saveUser(userName, socket.id);
    //     console.log('소켓서버측 로그인 응답위한 user', user);
    //     if (user) {
    //       // 사용자가 성공적으로 저장된 경우 성공 응답을 보냅니다.
    //       cb({ isOk: true, data: user });
    //     } else {
    //       // 사용자가 null인 경우 오류 응답을 보냅니다.
    //       cb({ isOk: false, message: '유효하지 않은 접근입니다.' });
    //     }
    //   } catch (error) {
    //     // 오류를 처리하고 오류 응답을 보냅니다.
    //     cb({ isOk: false, error: error.message });
    //   }
    // });
    //사용자 닉네임 모음 객체
    const nickObjs = {}; //{socket.id:nick1,socket.id:nick2}
    // 사용자가 채팅방에 참여하는 것을 처리
    socket.on('joinRoom', async (joinUser, rid, cb) => {
      try {
        const user = await userController.checkUser(joinUser);
        const isMember = await userController.joinRoom(rid, user);
        if (!isMember) {
          cb({ isOk: false, msg: '해당 그룹의 멤버가 아닙니다.' });
        } else {
          nickObjs[socket.id] = joinUser;
          socket.join(rid.toString());
          const chatLog = await userController.getChatLog(rid);
          updateList();
          cb({ isOk: true, data: chatLog });
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
    // chatSpace.to(user.rooms.toString()).emit('message', [welcomeMessage]);

    // 사용자가 채팅방을 나가는 것을 처리합니다.
    socket.on('leaveRoom', async (name, rid, cb) => {
      try {
        const user = await userController.checkUser(name);
        // await userController.leaveRoom(user);
        // const leaveMessage = {
        //   chat: `${user.nick_name}님이 나가셨습니다.`,
        //   user: { id: null, name: 'system' },
        // };
        // socket.broadcast.to(user.rooms.toString()).emit('message', leaveMessage);
        socket.leave(rid.toString());
        cb({ isOk: true });
      } catch (error) {
        cb({ isOk: false, message: error.message });
      }
    });

    // 채팅 메시지를 보내는 것을 처리합니다.
    socket.on('sendMessage', async (rid, name, whisper, receivedMessage, cb) => {
      try {
        console.log('rid는', rid);
        const user = await userController.checkUser(name);
        let dmSocketId = whisper.who;
        let receiver;
        if (user) {
          if (whisper.who === 'all') {
            const message = await userController.saveChat(rid, receiver, receivedMessage, user);
            // const chatLog = await userController.getChatLog(rid);
            chatSpace.to(rid.toString()).emit('message', message);
          } else {
            receiver = nickObjs[dmSocketId];
            const message = await userController.saveChat(rid, receiver, receivedMessage, user);
            chatSpace.to(dmSocketId).emit('dm', message);
            chatSpace.to(socket.id).emit('dm', message);
          }
          return cb({ isOk: true });
        }
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    // 사용자가 연결을 해제하는 것을 처리합니다.
    socket.on('disconnect', async () => {
      const user = await userController.deleteUser(socket.id);
      console.log('사용자가 소켓 연결을 해제했습니다');
    });
  });
};
