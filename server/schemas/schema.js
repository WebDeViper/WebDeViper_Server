const mongoose = require('mongoose');
const { Schema } = mongoose;

// Chat 스키마
const chatSchema = new Schema({
  chat: { type: String },
  sender: { type: String },
  receiver: { type: String, default: null },
  send_at: { type: Date, default: Date.now },
  user: {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 사용자 id
    name: { type: String },
  },
  room_id: { type: Schema.Types.ObjectId, ref: 'Room' },
});

//알림 스키마
const notificationSchema = new Schema({
  user_id: { type: String },
  content: { type: String },
  group_id: { type: String, default: null },
  is_read: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema, 'chat');
const Notification = mongoose.model('Notification', notificationSchema, 'notification');

module.exports = { Chat, Notification, mongoose };
