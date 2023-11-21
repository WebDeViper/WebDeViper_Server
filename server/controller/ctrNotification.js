const { Notification, mongoose } = require('../schemas/schema');
exports.patchNoticeNotification = async (req, res) => {
  try {
    console.log(req.body);
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '5f612ac1-1c96-4b6a-90dc-0ccaca5c4787';


    const result = await Notification.updateOne({ _id: req.body._id }, { $addToSet: { read_user_id: currentUserId } });


    console.log(result);
    if (result.modifiedCount === 1) {
      const notificationInfo = await Notification.findOne({

        _id: req.body._id,
        // notification_kind: req.body.notification_kind,

      });
      console.log('업데이트 성공: 값이 배열에 추가되었습니다.', notificationInfo._id);
      res.status(200).send({ isSuccess: true, _id: notificationInfo._id });
    } else {
      console.log('업데이트 실패: 매칭되는 문서를 찾을 수 없거나 이미 값이 존재합니다.');
      res.status(400).send({ isSuccess: false });
    }
  } catch (error) {
    console.error('업데이트 중 에러 발생:', error);
  }
};
