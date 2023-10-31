const User = require('../schemas/User');
const Chat = require('../schemas/Chat');
const { now } = require('mongoose');

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
exports.saveChatLog = async (message, userName) => {
  // 새로운 채팅 생성
  // console.log('userName값은 ', userName);
  const utcDate = new Date();

  // 한국 표준시(KST)의 시간대 오프셋
  const koreaTimeOffset = 9 * 60; // 9시간을 분으로 표시

  // UTC 시간에 한국 시간대 오프셋을 더하기
  utcDate.setMinutes(utcDate.getMinutes() + koreaTimeOffset);

  // 날짜 및 시간 추출
  const hours = utcDate.getUTCHours();
  const minutes = utcDate.getUTCMinutes();
  const day = utcDate.getUTCDate();
  const month = utcDate.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더함
  const year = utcDate.getUTCFullYear() % 100; // 두 자리 연도

  // 문자열로 조합
  const formattedDate = `${hours}:${minutes} [${year}/${month}/${day}]`;
  console.log(formattedDate);
  const newChatMessage = {
    group_id: 'group1', // 그룹 식별자
    message: message, // 채팅 메시지
    sender: userName, // 발신자 식별자
    receiver: 'user2', // 수신자 식별자
    sendAt: formattedDate, // 메시지 전송 시간
  };

  // Chat 모델을 사용하여 새로운 채팅 메시지 생성
  const newChat = new Chat(newChatMessage);
  try {
    const chat = await newChat.save();
    console.log('채팅이 성공적으로 저장되었습니다:', chat);
    return chat;
  } catch (error) {
    console.error('채팅 저장 중 오류 발생:', error);
    throw error;
  }
};

exports.getChatLog = async userName => {
  try {
    // const chats = await Chat.find({ 'user.name': { $ne: userName } });
    const chats = await Chat.find({});
    // const chats = await Chat.find();
    console.log('이전채팅기록 ->', chats);
    return chats;
  } catch (error) {
    console.error('채팅 로그 검색 중 오류 발생:', error);
    throw error;
  }
};
