const mongoose = require('mongoose');
const { Schema } = mongoose;

// User 스키마
const userSchema = new Schema({
  user_category_name: { type: String, required: true }, // 유저의 카테고리
  nick_name: String, // 유저의 닉네임
  user_profile_image_path: String, // 유저 프로필 이미지 경로
  status_message: String, // 유저의 상태메세지(카톡 같은)
  is_service_admin: Boolean, // 서비스 관리자 여부
  email: String, // 카카오한테 받은 유저 이메일
  provider: String, // 소셜로그인 제공업체
  sns_id: String, // 소셜로그인 제공업체로부터 받은 유저 식별값 (구글/카카오/네이버 전부 다를 수 있음)
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }], // 유저가 속한 그룹 리스트(배열)
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }], // 유저가 속한 채팅 룸 리스트(배열)
  chat_online: Boolean, // 확인 필요
  token: String, // 확인 필요
  pending_groups: [
    // 가입에 대한 승인 대기중인 그룹 리스트 배열
    {
      group: { type: Schema.Types.ObjectId, ref: 'Group' }, // 가입 신청한 그룹의 ID
      is_approved: { type: Boolean, default: false }, // 가입 승인 여부
    },
  ],
});

// Group 스키마
const groupSchema = new Schema({
  group_leader: { type: Schema.Types.ObjectId, ref: 'User' }, // 그룹장(User)의 ObjectId
  group_name: String, // 그룹의 이름
  group_category: String, // 그룹의 카테고리
  group_password: String, // 그룹 패스워드
  group_description: String, // 그룹에 대한 설명
  group_image_path: { type: String, default: '/api/notyet' },
  group_maximum_member: { type: Number, default: 5 }, // 그룹의 최대 수용인원
  daily_goal_time: String, // 그룹의 목표 공부시간
  is_camera_on: Boolean,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 그룹에 속한 사용자 리스트(배열)
  join_requests: [
    // 그룹에 가입 요청한 사용자 리스트(배열)
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 가입 신청한 유저의 _id
      is_approved: { type: Boolean, default: false }, // 가입 승인 여부
    },
  ],
});

// Room 스키마
const roomSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // User 모델을 참조  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Chat 스키마
const chatSchema = new Schema({
  sendAt: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 사용자 id
  room_id: { type: Schema.Types.ObjectId, ref: 'Room' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Timer 스키마
const timerSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  daily: {
    date: String, // 오늘 날짜
    data: [
      {
        title: { type: String }, // 과목
        timer: { type: Number }, // 초 단위로 공부한 시간
      },
    ],
  },
});

// Todo 스키마
const todoSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // 투두 작성자의 _id
  title: String,
  content: String,
  start_time: { type: Date },
  end_time: { type: Date },
  done: Boolean,
});

// Notice 스키마
const noticeSchema = new Schema({
  title: String, // 공지사항 제목
  content: String, // 공지사항 내용
  created_at: { type: Date, default: Date.now }, //등록날짜
  updated_at: { type: Date, default: Date.now }, //수정날짜
});

const User = mongoose.model('User', userSchema, 'user');
const Room = mongoose.model('Room', roomSchema, 'room');
const Chat = mongoose.model('Chat', chatSchema, 'chat');
const Group = mongoose.model('Group', groupSchema, 'group');
const Timer = mongoose.model('Timer', timerSchema, 'timer');
const Todo = mongoose.model('Todo', todoSchema, 'todo');
const Notice = mongoose.model('Notice', noticeSchema, 'notice');

module.exports = { User, Room, Chat, Group, Timer, Todo, Notice, mongoose };
