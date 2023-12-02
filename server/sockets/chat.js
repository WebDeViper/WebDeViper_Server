// chatModule.js
module.exports = function (socket, userController, groupId, userNickName) {
  socket.on('sendMessage', async (receivedMessage, cb) => {
    try {
      const user = await userController.checkUser(userNickName);
      let receiver;
      if (user) {
        const message = await userController.saveChat(groupId, receiver, receivedMessage, user);
        socket.to(groupId).emit('message', message);
        return cb({ isOk: true, message });
      }
    } catch (error) {
      cb({ isOk: false, error: error.message });
    }
  });

  socket.on('getMessage', async cb => {
    try {
      const user = await userController.checkUser(userNickName);

      const isMember = await userController.joinRoom(groupId, user);
      if (!isMember) {
        cb({ isOk: false, msg: '해당 그룹의 멤버가 아닙니다.' });
      } else {
        const chatLog = await userController.getChatLog(groupId);
        cb({ isOk: true, data: chatLog });
      }
    } catch (error) {
      cb({ isOk: false, error: error.message });
    }
  });
};
