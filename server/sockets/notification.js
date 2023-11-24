const notificationController = require('../controller/ctrNotice');
const { Notification } = require('../schemas/schema');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const jwt = require('jsonwebtoken');
const { User, Sequelize } = require('../models');

module.exports = function (io) {
  io.on('connection', socket => {
    const token = socket.handshake.auth.userId;
    console.log(token, '유저 토큰');

    // 미들웨어에서 넘겨받은 socket.id로 사용자 정보 업데이트
    // updateUserSocketId(token, socket.id);

    console.log(socket.id, '$$$$유저의 소켓 아이디$$$$');

    // 필요한 경우 더 많은 연결 이벤트 처리 로직 추가
  });

  // 미들웨어 설정
  io.use((socket, next) => {
    const token = socket.handshake.auth.userId;

    if (token !== undefined) {
      // 사용자 정보 업데이트
      updateUserSocketId(token, socket.id);
    }

    // 다음 미들웨어 또는 이벤트 핸들러로 계속 진행
    next();
  });

  // 사용자 정보 업데이트 함수
  updateUserSocketId = async (userId, socketId) => {
    await User.update({ socket_id: socketId }, { where: { user_id: userId } });
    console.log(`사용자 ${userId}의 소켓 아이디를 ${socketId}로 업데이트합니다.`);
  };
  // Notification 등록시 소켓 이벤트 발생
  const newNoticeNotification = {
    $match: {
      'fullDocument.notification_kind': 'new_notice',
      operationType: 'insert',
    },
  };
  const notificationChangeStreamOfNotice = Notification.watch([newNoticeNotification], {
    fullDocument: 'updateLookup',
  });
  notificationChangeStreamOfNotice.on('change', change => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      io.emit('newNotice', newNotification);
    }
  });
  const newGroupRequest = {
    $match: {
      'fullDocument.notification_kind': 'group_request',
      operationType: 'insert',
    },
  };
  const notificationChangeStreamOfGroupRequest = Notification.watch([newGroupRequest], {
    fullDocument: 'updateLookup',
  });
  notificationChangeStreamOfGroupRequest.on('change', change => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      io.emit('newGroupRequest', newNotification); //리더이게만 보내는 로직 추가해야 함
    }
  });
  const groupApprove = {
    $match: {
      'fullDocument.notification_kind': 'group_approve',
      operationType: 'insert',
    },
  };
  const notificationChangeStreamOfGroupApprove = Notification.watch([groupApprove], {
    fullDocument: 'updateLookup',
  });
  notificationChangeStreamOfGroupApprove.on('change', change => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      io.emit('newGroupApprove', newNotification); //그룹승인받은 유저에게만 보내는 로직 추가해야 함
    }
  });
};
