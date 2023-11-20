const { Notification, mongoose } = require('../schemas/schema');
exports.patchNoticeNotification = async (req, res) => {
  try {
    console.log(req.body);
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '5f612ac1-1c96-4b6a-90dc-0ccaca5c4787';

    const result = await Notification.updateOne(
      { content_id: req.body.content_id, notification_kind: req.body.notification_kind },
      { $addToSet: { read_user_id: currentUserId } }
    );
    console.log(result);
    if (result.modifiedCount === 1) {
      console.log('업데이트 성공: 값이 배열에 추가되었습니다.');
      res.status(200).send({ message: '업데이트 성공!' });
    } else {
      console.log('업데이트 실패: 매칭되는 문서를 찾을 수 없거나 이미 값이 존재합니다.');
      res.status(400).send({ message: '찾을 수 없는 정보' });
    }
  } catch (error) {
    console.error('업데이트 중 에러 발생:', error);
  }
};
