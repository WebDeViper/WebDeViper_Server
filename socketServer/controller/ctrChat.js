// const User = require('../schemas/User');
// const Chat = require('../schemas/Chat');
// const Room = require('../schemas/Room');
const { User, Group } = require('../schemas/viper_beta');

// 사용자 정보를 저장하거나 업데이트하는 함수
exports.saveUser = async (userName, socketid) => {
  // 이미 있는 사용자인지 확인
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
};

// 사용자의 토큰 (연결 정보)을 검사하고 해당 사용자를 반환
exports.checkUser = async socketid => {
  const user = await User.findOne({ token: socketid });
  if (!user) throw new Error('사용자를 찾을 수 없음');
  console.log(user);
  return user;
};

// // 메시지를 저장하는 함수
// exports.saveChat = async (message, user) => {
//   // 현재 시각을 UTC 시간대로 얻어옴.
//   const utcDate = new Date();

//   // 한국 표준시(KST)의 시간대 오프셋
//   const koreaTimeOffset = 9 * 60; // 9시간을 분으로 표시

//   // UTC 시간에 한국 시간대 오프셋을 더함.
//   utcDate.setMinutes(utcDate.getMinutes() + koreaTimeOffset);

//   // 날짜 및 시간 정보 추출
//   const hours = utcDate.getUTCHours();
//   const minutes = utcDate.getUTCMinutes();
//   const day = utcDate.getUTCDate();
//   const month = utcDate.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더함
//   const year = utcDate.getUTCFullYear() % 100; // 두 자리 연도

//   // 메시지의 전송 시간을 문자열로 조합
//   const formattedDate = `${hours}:${minutes} [${year}/${month}/${day}]`;

//   // Chat 모델을 사용하여 새로운 메시지를 생성하고 저장
//   const newMessage = new Chat({
//     chat: message,
//     sendAt: formattedDate,
//     user: {
//       id: user._id,
//       nick_name: user.nick_name,
//     },
//     room: user.room,
//   });
//   await newMessage.save();
//   return newMessage;
// };

// // 이전 채팅 로그를 검색하는 함수
// exports.getChatLog = async rid => {
//   try {
//     const chats = await Chat.find({ room: rid });
//     console.log('이전 채팅 기록 ->', chats);
//     return chats;
//   } catch (error) {
//     console.error('채팅 로그 검색 중 오류 발생:', error);
//     throw error;
//   }
// };

// // 모든 채팅방의 목록을 반환하는 함수
// exports.getAllRooms = async () => {
//   const roomList = await Room.find({});
//   return roomList;
// };

// // 사용자가 채팅방을 나가는 함수
// exports.leaveRoom = async user => {
//   const room = await Room.findById(user.room);
//   if (!room) {
//     throw new Error('채팅방을 찾을 수 없음');
//   }
//   room.members.remove(user._id);
//   await room.save();
// };

// // 사용자가 채팅방에 참여하는 함수
// exports.joinRoom = async (roomId, user) => {
//   const room = await Room.findById(roomId);
//   // console.log('해당하는 방 리스트 findById', room);
//   if (!room) {
//     throw new Error('해당 방이 없습니다.');
//   }
//   if (!room.members.includes(user._id)) {
//     room.members.push(user._id);
//     await room.save();
//   }
//   user.room = roomId;
//   await user.save();
// };
