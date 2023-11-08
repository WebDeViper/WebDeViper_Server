const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const { User, Group, Room, mongoose } = require('../schemas/schema');

module.exports = function (io) {
  const chatSpace = io.of('/chat');
  let name; // 사용자의 이름을 저장하는 변수
  chatSpace.on('connection', async socket => {
    console.log('client is connected', socket.id);
    // 사용자 로그인을 처리합니다.
    socket.on('login', async (userName, cb) => {
      try {
        name = userName;
        const user = await userController.saveUser(userName, socket.id);
        console.log('소켓서버측 로그인 응답위한 user', user);
        if (user) {
          // 사용자가 성공적으로 저장된 경우 성공 응답을 보냅니다.
          cb({ isOk: true, data: user });
        } else {
          // 사용자가 null인 경우 오류 응답을 보냅니다.
          cb({ isOk: false, message: '유효하지 않은 접근입니다.' });
        }
      } catch (error) {
        // 오류를 처리하고 오류 응답을 보냅니다.
        cb({ isOk: false, error: error.message });
      }
    });

    // 사용자가 채팅방에 참여하는 것을 처리합니다.
    socket.on('joinRoom', async (joinUser, rid, cb) => {
      try {
        await userController.saveUser(joinUser, socket.id);
        const user = await userController.checkUser(joinUser);

        // user.rooms 초기화
        user.rooms = [];

        await userController.joinRoom(rid, user);

        // 'user.rooms' 값이 설정된 이후에 'socket.join' 호출
        socket.join(user.rooms.toString());

        const welcomeMessage = {
          chat: `${user.nick_name}님이 입장하셨습니다.`,
          user: { id: null, name: 'system' },
        };
        console.log(welcomeMessage);
        const chatLog = await userController.getChatLog(rid);
        const isToken = await userController.isToken(name);
        if (!isToken) {
          //token값이 없다면
          chatSpace.to(user.rooms.toString()).emit('message', [...chatLog, welcomeMessage]);
        } else {
          chatSpace.to(user.rooms.toString()).emit('message', [welcomeMessage]);
        }
        cb({ isOk: true, data: user });
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    // 사용자가 채팅방을 나가는 것을 처리합니다.
    socket.on('leaveRoom', async (name, cb) => {
      try {
        const user = await userController.checkUser(name);
        // await userController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.nick_name}님이 나가셨습니다.`,
          user: { id: null, name: 'system' },
        };
        socket.broadcast.to(user.rooms.toString()).emit('message', leaveMessage);
        socket.leave(user.rooms.toString());
        cb({ isOk: true });
      } catch (error) {
        cb({ isOk: false, message: error.message });
      }
    });

    // 특정 채팅방의 채팅 로그를 가져오는 것을 처리합니다.
    // socket.on('getChatLog', async (rid, cb) => {
    //   try {
    //     const chatLog = await userController.getChatLog(rid);
    //     cb({ isOk: true, data: chatLog });
    //   } catch (error) {
    //     cb({ isOk: false, error: error.message });
    //   }
    // });

    // 채팅 메시지를 보내는 것을 처리합니다.
    socket.on('sendMessage', async (rid, name, receivedMessage, cb) => {
      try {
        console.log('rid는', rid);
        const user = await userController.checkUser(name);
        if (user) {
          const message = await userController.saveChat(rid, receivedMessage, user);
          chatSpace.to(user.rooms.toString()).emit('message', message);
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
