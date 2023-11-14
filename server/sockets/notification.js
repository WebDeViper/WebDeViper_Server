const notificationController = require('../controller/ctrNotice');
const { Notification } = require('../schemas/schema');
module.exports = function (io) {
  //Notification 등록시 소켓 이벤트 발생
  const notificationChangeStream = Notification.watch([], { fullDocument: 'updateLookup' });

  // $match stage를 사용하여 notification_kind가 'new_notification'인 변경 사항만 감지
  const matchStage = {
    $match: {
      'fullDocument.notification_kind': 'new_notification',
      operationType: 'insert',
    },
  };
  notificationChangeStream.on('change', change => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      io.emit('newNotification', newNotification);
    }
  });
};
