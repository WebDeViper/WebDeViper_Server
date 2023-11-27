const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const { User, Group, Room, mongoose } = require('../schemas/schema');

module.exports = function (io) {
  const chatSpace = io.of('/zoom');
  const nickObjs = {}; //{socket.id:nick1,socket.id:nick2}

  function updateList() {
    io.emit('updateNicks', nickObjs); // 전체 사용자 닉네임 모음 객체 전달
  }
  chatSpace.on('connection', async socket => {
    console.log('client is connected in chat!!', socket.id);
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
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    // 사용자가 채팅방을 나가는 것을 처리합니다.
    socket.on('leaveRoom', async (name, rid, cb) => {
      try {
        const user = await userController.checkUser(name);
        socket.leave(rid.toString());
        cb({ isOk: true });
      } catch (error) {
        cb({ isOk: false, message: error.message });
      }
    });

    // 채팅 메시지를 보내는 것을 처리합니다.
    socket.on('sendMessage', async (rid, name, receivedMessage, cb) => {
      try {
        console.log('rid는', rid);
        const user = await userController.checkUser(name);
        let receiver;
        if (user) {
          const message = await userController.saveChat(rid, receiver, receivedMessage, user);
          chatSpace.to(rid.toString()).emit('message', message);

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
