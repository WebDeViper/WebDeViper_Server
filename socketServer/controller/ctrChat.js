const User = require('../schemas/User');
const Chat = require('../schemas/Chat');

// 사용자 정보를 저장하거나 업데이트하는 함수
exports.saveUser = async (userName, socketid) => {
  // 이미 있는 사용자인지 확인
  const user = await User.findOne({ nick_name: userName });

  // 사용자가 존재하지 않으면 새 사용자 정보를 생성
  if (!user) {
    return user;
  }

  // 이미 존재하는 사용자의 연결 정보 (token)를 업데이트하고 온라인 상태로 설정
  user.token = socketid;
  user.online = true;

  await user.save();
  return user;
};

// 사용자의 토큰 (연결 정보)을 검사하고 해당 사용자를 반환
exports.checkUser = async socketid => {
  const user = await User.findOne({ token: socketid });
  if (!user) throw new Error('user not found');
  return user;
};

// 메시지를 저장하는 함수
exports.saveChat = async (message, user) => {
  // 현재 시각을 UTC 시간대로 얻어옵니다.
  const utcDate = new Date();

  // 한국 표준시(KST)의 시간대 오프셋
  const koreaTimeOffset = 9 * 60; // 9시간을 분으로 표시

  // UTC 시간에 한국 시간대 오프셋을 더합니다.
  utcDate.setMinutes(utcDate.getMinutes() + koreaTimeOffset);

  // 날짜 및 시간 정보 추출
  const hours = utcDate.getUTCHours();
  const minutes = utcDate.getUTCMinutes();
  const day = utcDate.getUTCDate();
  const month = utcDate.getUTCMonth() + 1; // getUTCMonth()는 0부터 시작하므로 1을 더합니다.
  const year = utcDate.getUTCFullYear() % 100; // 두 자리 연도

  // 메시지의 전송 시간을 문자열로 조합합니다
  const formattedDate = `${hours}:${minutes} [${year}/${month}/${day}]`;

  // Chat 모델을 사용하여 새로운 메시지를 생성하고 저장합니다
  const newMessage = new Chat({
    chat: message,
    sendAt: formattedDate,
    user: {
      id: user._id,
      nick_name: user.nick_name,
    },
  });
  await newMessage.save();
  return newMessage;
};

// 이전 채팅 로그를 검색하는 함수
exports.getChatLog = async () => {
  try {
    const chats = await Chat.find({});
    console.log('이전 채팅 기록 ->', chats);
    return chats;
  } catch (error) {
    console.error('채팅 로그 검색 중 오류 발생:', error);
    throw error;
  }
};
