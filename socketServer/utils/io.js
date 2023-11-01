const userController = require('../controller/ctrChat');
const User = require('../schemas/User');
const Room = require('../schemas/Room');
module.exports = function (io) {
  let name;
  io.on('connection', async socket => {
    console.log('client is connected', socket.id);
    // 임의로 room 생성
    Room.find({
      $or: [{ room: '공무원' }, { room: '취준생' }, { room: '연습생' }],
    }).then(rooms => {
      // console.log('방잇나여', rooms);
      if (rooms.length === 0) {
        Room.insertMany([
          {
            room: '공무원',
            members: [],
          },
          {
            room: '취준생',
            members: [],
          },
          {
            room: '연습생',
            members: [],
          },
        ])
          .then(() => console.log('ok'))
          .catch(error => console.error(error));
        // console.log('방 이미 잇음');
      }
    });

    // 유저관련
    socket.on('login', async (userName, cb) => {
      try {
        name = userName;
        const user = await userController.saveUser(userName, socket.id);
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
    socket.emit('rooms', await userController.getAllRooms()); // 룸 리스트 보내기
    socket.on('joinRoom', async (joinUser, rid, cb) => {
      try {
        // console.log('조인룸 유저정보', joinUser);
        const saveuser = await userController.saveUser(joinUser.nick_name, socket.id);
        // console.log('유저정보는', saveuser);
        const user = await userController.checkUser(socket.id); // 일단 유저정보들고오기
        await userController.joinRoom(rid, user); // 1~2작업
        socket.join(user.room.toString()); //3 작업
        const welcomeMessage = {
          chat: `${user.nick_name} is joined to this room`,
          user: { id: null, name: 'system' },
        };

        io.to(user.room.toString()).emit('message', welcomeMessage); // 4 작업
        const room = io.emit('rooms', await userController.getAllRooms()); // 5 작업
        cb({ ok: true, data: room });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });
    socket.on('leaveRoom', async (_, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        console.log('유저는 ', user);
        await userController.leaveRoom(user);
        const leaveMessage = {
          chat: `${user.nick_name} left this room`,
          user: { id: null, name: 'system' },
        };
        socket.broadcast.to(user.room.toString()).emit('message', leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다
        io.emit('rooms', await userController.getAllRooms());
        socket.leave(user.room.toString()); // join했던 방을 떠남
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, message: error.message });
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

    socket.on('sendMessage', async (receivedMessage, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        if (user) {
          const message = await userController.saveChat(receivedMessage, user);
          io.to(user.room.toString()).emit('message', message); // 이부분을 그냥 emit에서 .to().emit() 으로 수정
          // io.emit('message', message);
          return cb({ ok: true });
        }
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    socket.on('disconnect', async () => {
      const user = await User.findOne({ nick_name: name });
      if (user) {
        user.online = false;
        await user.save();
      }
      console.log('user is disconnected', user);
    });
  });
};
