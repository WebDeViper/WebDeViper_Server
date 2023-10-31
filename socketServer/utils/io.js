const userController = require('../controller/ctrChat');

module.exports = function (io) {
  io.on('connection', async socket => {
    console.log('client is connected', socket.id);

    socket.on('login', async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        console.log(user);
        if (user) {
          //user가 null이 아니라면
          cb({ ok: true, data: user });
        } else {
          cb({ ok: false, message: '잘못된 접근입니다.' });
        }
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });
    // 'userName'을 socket에 연결된 사용자의 이름으로 저장합니다.
    socket.on('getChatLog', async (userName, cb) => {
      try {
        const chatLog = await userController.getChatLog(userName);
        cb({ ok: true, data: chatLog });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // 클라이언트에서 채팅 메시지를 전송받는 핸들러
    socket.on('send', async function (data, cb) {
      console.log(data.name, ': ', data.msg);
      try {
        const chat = await userController.saveChatLog(data.msg, data.name); // 수정된 부분
        console.log('send의 return값인 chat는 ', chat);
        cb({ data: chat });

        // 서버에서 메시지 수신시 전송한 클라이언트를 제외한 나머지 클라이언트에게 해당 메시지 전달.
        socket.broadcast.emit('msg', chat);
      } catch (error) {
        cb({ error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('user is disconnected');
    });
  });
};
