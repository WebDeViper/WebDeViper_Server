// chatModule.js
module.exports = function (socket, userController, nickObjs, updateList, cb) {
  // Your chat-specific logic here
  socket.on('test', (res, cb) => {
    cb('dddd');
    console.log(res, 'resres');
  });
  socket.on('sendMessage', async (rid, name, receivedMessage, cb) => {
    try {
      console.log('rid는', rid);
      const user = await userController.checkUser(name);
      let receiver;
      if (user) {
        console.log('메시지는 몇개씩????');
        const message = await userController.saveChat(rid, receiver, receivedMessage, user);
        socket.to(rid.toString()).emit('message', message);
        return cb({ isOk: true });
      }
    } catch (error) {
      cb({ isOk: false, error: error.message });
    }
  });

  // Move the chat log fetching logic here
  async function handleJoinRoom(joinUser, rid, cb) {
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

        const chatLog = await userController.getChatLog(rid);
        updateList();
        cb({ isOk: true, data: chatLog });
        socket.to(rid).emit('getUsers', nickObjs[rid]);
        console.log(user, 'nickObjsnickObjs');
      }
    } catch (error) {
      cb({ isOk: false, error: error.message });
    }
  }

  // Expose the handleJoinRoom function
  return { handleJoinRoom };
};
