const notificationController = require('../controller/ctrNotice');
const { Notification } = require('../schemas/schema');
module.exports = function (io) {
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
      io.emit('newGroupRequest', newNotification); //그룹승인받은 유저에게만 보내는 로직 추가해야 함
    }
  });
};
