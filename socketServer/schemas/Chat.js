const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    // group_id: { type: String, required: true }, // 그룹 식별자
    // message: { type: String, required: true }, // 채팅 메시지
    // sender: { type: String, required: true }, // 발신자 식별자
    // receiver: { type: String, required: true }, // 수신자 식별자 (추가)(귓속말 기능 위해서)

    chat: String,
    sendAt: { type: String, required: true }, // 메시지 전송 시간
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      nick_name: String,
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
    },
  },
  { timestamp: true }
);

// module.exports = mongoose.model('chat', chatSchema);
