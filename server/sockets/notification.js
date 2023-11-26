const notificationController = require('../controller/ctrNotice');
const { Notification } = require('../schemas/schema');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const jwt = require('jsonwebtoken');
const { User, Group, UserGroupRelation, Sequelize } = require('../models');

module.exports = function (io) {
  io.on('connection', socket => {
    const token = socket.handshake.auth.userId;
    console.log(token, '유저 토큰');

    // 미들웨어에서 넘겨받은 socket.id로 사용자 정보 업데이트
    // updateUserSocketId(token, socket.id);

    console.log(socket.id, '$$$$유저의 소켓 아이디$$$$');

    // 필요한 경우 더 많은 연결 이벤트 처리 로직 추가
    const newNoticeNotification = {
      $match: {
        'fullDocument.notification_kind': 'new_notice',
        operationType: 'insert',
      },
    };
    const notificationChangeStreamOfNotice = Notification.watch([newNoticeNotification], {
      fullDocument: 'updateLookup',
    });

    // 기존에 등록된 모든 'change' 이벤트 리스너를 제거
    // notificationChangeStreamOfNotice.removeAllListeners('change');

    notificationChangeStreamOfNotice.on('change', change => {
      notificationChangeStreamOfNotice.removeAllListeners('change');
      if (change.operationType === 'insert') {
        const newNotification = change.fullDocument;
        io.to(socket.id).emit('newNotice', newNotification);
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
    notificationChangeStreamOfGroupRequest.on('change', async change => {
      if (change.operationType === 'insert') {
        const newNotification = change.fullDocument;
        console.log('%%%%%%그룹요청%%%%%%', newNotification);
        const leaderId = newNotification.user_id;
        const groupId = newNotification.group_id;
        const leaderInfo = await User.findOne({ where: { user_id: leaderId } });
        const requestUser = await UserGroupRelation.findAll({
          where: { group_id: groupId, request_status: 'w' },
          order: [['updatedAt', 'DESC']], // updatedAt 기준으로 내림차순 정렬
          limit: 1, // 결과를 1개로 제한
        });
        const requestUserId = requestUser[0].dataValues.user_id;
        console.log('대기중인 유저###', requestUserId);
        const requestUserInfo = await User.findOne({ where: { user_id: requestUserId } });

        // console.log(leaderInfo, '<<<<<<<<<');
        const leaderSocketId = leaderInfo.dataValues.socket_id;
        newNotification.user_id = requestUserInfo.dataValues.nick_name;

        console.log('새로운 그룹요청 정보!!!', newNotification);
        // console.log('#######',newNotificaiton.user_id)

        io.to(leaderSocketId).emit('newGroupRequest', newNotification); //리더이게만 보내는 로직 추가해야 함
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
    notificationChangeStreamOfGroupApprove.on('change', async change => {
      if (change.operationType === 'insert') {
        const newNotification = change.fullDocument;
        const requestId = newNotification.user_id;
        const requestUserInfo = await User.findOne({ where: { user_id: requestId } });
        const requestUserSocketId = requestUserInfo.dataValues.socket_id;
        io.to(requestUserSocketId).emit('newGroupApprove', newNotification); //그룹승인받은 유저에게만 보내는 로직 추가해야 함
      }
    });
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
};
