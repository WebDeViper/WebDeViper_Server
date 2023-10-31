const userController = require('../controller/ctrChat');

module.exports = function (io) {
  io.on('connection', async socket => {
    console.log('client is connected', socket.id);
    // 유저관련
    socket.on('login', async (userName, cb) => {
      try {
        const user = await userController.saveUser(userName, socket.id);
        const welcomeMessage = {
          chat: `${user.nick_name}님이 입장하셨습니다.`,
          user: { id: null, nick_name: 'system' },
        };
        io.emit('message', welcomeMessage);
        if (user) {
          //user가 null이 아니라면
          cb({ isOk: true, data: user });
        } else {
          cb({ isOk: false, message: '잘못된 접근입니다.' });
        }
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    socket.on('getChatLog', async cb => {
      try {
        const chatLog = await userController.getChatLog();
        cb({ isOk: true, data: chatLog });
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    socket.on('sendMessage', async (message, cb) => {
      try {
        //유저 찾기 socket.id로
        const user = await userController.checkUser(socket.id);
        //메세지 저장 (유저)
        const newMessage = await userController.saveChat(message, user);
        io.emit('message', newMessage);
        cb({ isOk: true });
      } catch (error) {
        cb({ isOk: false, error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('user is disconnected');
    });
  });
};
