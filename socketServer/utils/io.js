const userController = require('../controller/ctrChat'); // 사용자 컨트롤러를 가져옵니다.
const { User, Group, Room, mongoose } = require('../schemas/viper_beta');

module.exports = function (io) {
  let name; // 사용자의 이름을 저장하는 변수

  io.on('connection', async socket => {
    console.log('client is connected', socket.id);
    // 모든 그룹을 조회
    const groups = await Group.find({}).exec();

    // 각 그룹에 대해 room 문서 생성 및 동기화
    groups.forEach(async group => {
      const roomData = {
        group: group._id, // 그룹의 ID 참조
        room: group.group_name, // 방 이름을 그룹 이름으로 설정
        members: group.members, // 그룹의 멤버를 그대로 복사
      };

      try {
        const savedRoom = await Room.findOneAndUpdate({ room: group.group_name }, roomData, { upsert: true });
        console.log(`방 (${group.group_name}) 동기화 또는 업데이트 완료.`);
      } catch (err) {
        console.error(`방 (${group.group_name}) 동기화 중 오류 발생:`, err);
      }
    });

    // 사용자 로그인을 처리합니다.
    socket.on('login', async (userName, cb) => {
      try {
        name = userName;
        const user = await userController.saveUser(userName, socket.id);

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

    // 연결된 클라이언트에 채팅방 목록을 보냅니다.
    socket.emit('rooms', await userController.getAllRooms());

    // 사용자가 채팅방에 참여하는 것을 처리합니다.
    socket.on('joinRoom', async (joinUser, rid, cb) => {
      try {
        await userController.saveUser(joinUser.nick_name, socket.id);
        const user = await userController.checkUser(socket.id);

        // user.rooms 초기화
        user.rooms = [];

        await userController.joinRoom(rid, user);

        // 'user.rooms' 값이 설정된 이후에 'socket.join' 호출
        socket.join(user.rooms.toString());

        const welcomeMessage = {
          chat: `${user.nick_name}님이 입장하셨습니다.`,
          user: { id: null, name: 'system' },
        };
        io.to(user.rooms.toString()).emit('message', welcomeMessage);
        io.emit('rooms', await userController.getAllRooms());
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // // 사용자가 채팅방을 나가는 것을 처리합니다.
    // socket.on('leaveRoom', async (_, cb) => {
    //   try {
    //     const user = await userController.checkUser(socket.id);
    //     await userController.leaveRoom(user);
    //     const leaveMessage = {
    //       chat: `${user.nick_name}님이 나가셨습니다.`,
    //       user: { id: null, name: 'system' },
    //     };
    //     socket.broadcast.to(user.room.toString()).emit('message', leaveMessage);
    //     io.emit('rooms', await userController.getAllRooms());
    //     socket.leave(user.room.toString());
    //     cb({ ok: true });
    //   } catch (error) {
    //     cb({ ok: false, message: error.message });
    //   }
    // });

    // // 특정 채팅방의 채팅 로그를 가져오는 것을 처리합니다.
    // socket.on('getChatLog', async (rid, cb) => {
    //   try {
    //     const chatLog = await userController.getChatLog(rid);
    //     cb({ isOk: true, data: chatLog });
    //   } catch (error) {
    //     cb({ isOk: false, error: error.message });
    //   }
    // });

    // // 채팅 메시지를 보내는 것을 처리합니다.
    // socket.on('sendMessage', async (receivedMessage, cb) => {
    //   try {
    //     const user = await userController.checkUser(socket.id);
    //     if (user) {
    //       const message = await userController.saveChat(receivedMessage, user);
    //       io.to(user.room.toString()).emit('message', message);
    //       return cb({ ok: true });
    //     }
    //   } catch (error) {
    //     cb({ ok: false, error: error.message });
    //   }
    // });

    // 사용자가 연결을 해제하는 것을 처리합니다.
    socket.on('disconnect', async () => {
      console.log('사용자가 소켓 연결을 해제했습니다');
    });
  });
};
