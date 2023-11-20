const mongoose = require('mongoose');
const { Schema } = mongoose;

// Chat 스키마
const chatSchema = new Schema({
  chat: { type: String },
  sender: { id: { type: String }, name: { type: String } },
  receiver: { receive_id: { type: String, default: null }, name: { type: String } },
  send_at: { type: Date, default: Date.now },
  room_id: { type: String },
});

//알림 스키마
const notificationSchema = new Schema({
  user_id: { type: String },
  content: { type: String },
  content_id: { type: String },
  read_user_id: { type: Array, default: null },
  notification_kind: {
    type: String,
    // enum: [
    //   'chat_whisper',
    //   'group_request',
    //   'group_deletion',
    //   'group_rejection',
    //   'group_approve',
    //   'new_notice',
    // ],
  },
  group_id: { type: String, default: null },
  is_read: { type: String, default: 'n', maxlength: 1 },
  updated_at: { type: Date, default: Date.now },
});

//타이머 스키마
const timerSchema = new Schema({
  user_id: { type: String },
  total_time: { type: Number, default: 0 },
  is_running: { type: String, default: 'n', maxlength: 1 }, // Change Boolean to String
  daily: {
    date: { type: Date, default: Date.now }, // 오늘 날짜
    data: [
      {
        title: { type: String }, // 과목
        timer: { type: Number, default: 0 }, // 초 단위로 공부한 시간
      },
    ],
  },
});

const Timer = mongoose.model('Timer', timerSchema, 'timer');
const Chat = mongoose.model('Chat', chatSchema, 'chat');
const Notification = mongoose.model('Notification', notificationSchema, 'notification');

module.exports = { Chat, Notification, Timer, mongoose };
