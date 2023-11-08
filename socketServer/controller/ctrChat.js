const { User, Group, Chat, mongoose } = require('../schemas/schema');

// 사용자 정보를 저장하거나 업데이트하는 함수
exports.saveUser = async (userName, socketid) => {
  try {
    // 이미 있는 사용자인지 확인
    console.log('userName은 컨트롤러 함수에서 ', userName);
    const user = await User.findOne({ nick_name: userName });
    console.log('user는', user);
    // 사용자가 존재하지 않으면 새 사용자 정보를 생성
    if (!user) {
      return user;
    }
    // 이미 존재하는 사용자의 연결 정보 (token)를 업데이트하고 온라인 상태로 설정
    user.token = socketid;
    // user.online = true;

    await user.save();
    return user;
  } catch (err) {
    console.error(err);
  }
};
exports.deleteUser = async socketId => {
  try {
    const user = await User.findOne({ token: socketId });
    console.log('user는', user);
    // 사용자가 존재하지 않으면 새 사용자 정보를 생성
    if (!user) {
      return user;
    }
    // 이미 존재하는 사용자의 연결 정보 (token)를 업데이트하고 온라인 상태로 설정
    user.token = null;
    // user.online = true;

    await user.save();
    return user;
  } catch (err) {
    console.error(err);
  }
};
exports.isToken = async name => {
  try {
    const user = await User.findOne({ nick_name: name });
    User.findOne({ nick_name: name }, (err, user) => {
      if (err) {
        console.error('데이터베이스 쿼리 오류:', err);
      } else {
        if (user) {
          if (user.token) {
            console.log(`사용자 ${name}의 토큰 값: ${user.token}`);
            const token = user.token;
          } else {
            console.log(`사용자 ${name}는 토큰 값을 가지고 있지 않습니다.`);
            const token = null;
          }
        } else {
          console.log(`사용자 ${name}를 찾을 수 없음`);
        }
      }
    });
    console.log('token은 ->', token);
    return token;
  } catch (err) {
    console.error(err);
  }
};

// 사용자의 토큰 (연결 정보)을 검사하고 해당 사용자를 반환
exports.checkUser = async joinUser => {
  try {
    console.log('check User함수에서 nick_name은', joinUser);
    const user = await User.findOne({ nick_name: joinUser });
    if (!user) throw new Error('사용자를 찾을 수 없음');
    console.log(user);
    return user;
  } catch (err) {
    console.error(err);
  }
};

// 사용자가 채팅방에 참여하는 함수
exports.joinRoom = async (roomId, user) => {
  try {
    console.log(roomId);
    const room = await Group.findById(roomId);
    if (!room) {
      throw new Error('해당 방이 없습니다.');
    }

    if (!room.members.includes(user._id)) {
      console.log('해당 그룹의 유저가 아닙니다.');
    }

    if (!user.rooms.includes(roomId)) {
      user.rooms.push(roomId);
      await user.save();
      console.log('룸 아이디 추가 완료');
    } else {
      console.log('이미 룸 아이디가 존재합니다.');
    }
  } catch (err) {
    console.error(err);
  }
};
// 메시지를 저장하는 함수
exports.saveChat = async (rid, message, user) => {
  try {
    // 현재 시각을 UTC 시간대로 얻어옴.
    const utcDate = new Date();

    // 한국 표준시(KST)의 시간대 오프셋
    const koreaTimeOffset = 9 * 60; // 9시간을 분으로 표시

    // UTC 시간에 한국 시간대 오프셋을 더함.
    utcDate.setMinutes(utcDate.getMinutes() + koreaTimeOffset);

    // 날짜 및 시간 정보 추출
    const hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes();
    const day = utcDate.getUTCDate();
    const month = utcDate.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더함
    const year = utcDate.getUTCFullYear() % 100; // 두 자리 연도

    // 메시지의 전송 시간을 문자열로 조합
    // const formattedDate = `${hours}:${minutes} [${year}/${month}/${day}]`;

    // Chat 모델을 사용하여 새로운 메시지를 생성하고 저장
    const newMessage = new Chat({
      chat: message,
      sender: user.nick_name,
      // send_at: formattedDate,
      user: {
        user_id: user._id,
        name: user.nick_name,
      },
      room_id: rid,
    });
    await newMessage.save();
    const msg = {
      chat: message,
      user: { id: null, name: user.nick_name },
    };
    return msg;
  } catch (err) {
    console.error(err);
  }
};

// 이전 채팅 로그를 검색하는 함수
exports.getChatLog = async rid => {
  try {
    const chats = await Chat.find({ room_id: rid });
    console.log('이전 채팅 기록 ->', chats);
    // const msg = {
    //   chat: chats.chat,
    //   user: { id: null, name: chats.sender },
    // };
    return chats;
  } catch (error) {
    console.error('채팅 로그 검색 중 오류 발생:', error);
    throw error;
  }
};

// 모든 채팅방의 목록을 반환하는 함수
// exports.getAllRooms = async () => {
//   const roomList = await Group.find({});
//   console.log('겟룸실행', roomList);
//   return res.send(roomList);
// };

// // 사용자가 채팅방을 나가는 함수
// exports.leaveRoom = async user => {
//   const room = await Room.findById(user.rooms);
//   if (!room) {
//     throw new Error('채팅방을 찾을 수 없음');
//   }
//   room.members.remove(user._id);
//   await room.save();
// };
