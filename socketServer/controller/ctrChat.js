const User = require('../schemas/User');

let user;
let message;
exports.saveUser = async (userName, socketid) => {
  console.log('유저정보 등록 ');
  try {
    // const users = await User.find({});
    console.log('모든 사용자:', User);
  } catch (err) {
    console.error('데이터베이스에서 데이터를 조회하는 중 오류 발생:', err);
  }

  // 이미 있는 유저인지 확인
  user = await User.findOne({ 'user.nick_name': userName });
  // 없다면 새로 유저 정보 만들기
  console.log('user는', user);
  return user;
};
// exports.saveChatLog = async (message, userName) => {
//   // 새로운 채팅 생성
//   console.log('userName값은 ', userName);
//   const newChat = new Chat({
//     message: message,
//     user: {
//       id: user._id,
//       name: userName,
//     },
//   });

//   try {
//     const chat = await newChat.save();
//     console.log('채팅이 성공적으로 저장되었습니다:', chat);
//     return chat;
//   } catch (error) {
//     console.error('채팅 저장 중 오류 발생:', error);
//     throw error;
//   }
// };

// exports.getChatLog = async userName => {
//   try {
//     const chats = await Chat.find({ 'user.name': { $ne: userName } });
//     // const chats = await Chat.find();
//     console.log('이전채팅기록 ->', chats);
//     return chats;
//   } catch (error) {
//     console.error('채팅 로그 검색 중 오류 발생:', error);
//     throw error;
//   }
// };

// module.exports = ctrChat;
