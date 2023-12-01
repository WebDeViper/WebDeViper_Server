const { Notice, User, Sequelize } = require('../models');
const { Notification, mongoose } = require('../schemas/schema');
exports.getNotice = async (req, res) => {
  try {
    const currentPage = req.query.currentPage || 1;
    const itemsPerPage = 10;
    const offset = (currentPage - 1) * itemsPerPage;

    const result = await Notice.findAll({
      limit: itemsPerPage,
      offset,
    });
    //총 공지사항 갯수
    const total = await Notice.count();

    console.log(result, '총 공지사항');
    console.log(total, '공지사항 갯수');
    console.log('>>>>', req.query.currentPage);

    res.status(200).send({ notices: result, total });
  } catch (err) {
    console.error(err);
    res.status(500).send('SERVER ERROR');
  }
};
exports.postNotice = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '308814e1-9ff7-4846-b01b-64e290c40c1f';
    const user = await User.findOne({ where: { user_id: currentUserId } });
    console.log(user);
    if (user.is_admin === 'y') {
      console.log(req.body);
      const result = await Notice.create({
        title: req.body.title,
        content: req.body.content,
        date: Date.now(),
      });
      console.log('result', result.dataValues);
      //notification스키마에 추가
      const newNotification = new Notification({
        user_id: 'admin',
        content: req.body.title,
        content_id: result.dataValues.notice_id,
        notification_kind: 'new_notice',
      });
      await newNotification.save();
      res.status(201).send({ result, message: '공지사항이 성공적으로 생셩되었습니다.' });
    } else {
      res.status(403).send({ message: '공지사항 등록권한이 없습니다.' });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.patchNotice = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '01adc61d-243c-4bf4-aec6-914b813b987c';
    const user = await User.findOne({ where: { user_id: currentUserId } });

    console.log(req.params.notice_id);
    console.log(req.body);
    if (user.is_admin === 'y') {
      const result = await Notice.update(
        { title: req.body.title, content: req.body.content },
        {
          where: {
            notice_id: req.params.notice_id,
          },
        }
      );
      console.log(result);
      if (result > 0) {
        const data = await Notice.findOne({ where: { notice_id: req.params.notice_id } });

        // console.log('과연 찾았을까?', result);
        res.status(201).send({ status: 'success', data, message: '공지사항이 성공적으로 업데이트 되었습니다.' });
      } else {
        res.status(400).send({ status: 'fail', message: '존재하지 않는 공지사항입니다.' });
      }
    } else {
      res.status(403).send({ message: '공지사항 수정 권한이 없습니다.' });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.deleteNotice = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '01adc61d-243c-4bf4-aec6-914b813b987c';
    const user = await User.findOne({ where: { user_id: currentUserId } });
    console.log(req.params.notice_id);
    if (user.is_admin === 'y') {
      if (req.params.notice_id) {
        const result = await Notice.destroy({ where: { notice_id: req.params.notice_id } });
        await Notification.deleteOne({ notification_kind: 'new_notice', content_id: req.params.notice_id });
        if (result) {
          res.status(200).send({ message: '공지사항이 성공적으로 삭제되었습니다!' });
        } else {
          res.status(400).send({ message: '잘못된 요청입니다.' });
        }
      }
      //삭제될 때 알람 스키마에서도 지워야함!!!!
    } else {
      res.status(403).send({ message: '공지사항 삭제권한이 없습니다.' });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.getNoticeDetail = async (req, res) => {
  try {
    const noticeDetailInfo = await Notice.findOne({ where: { notice_id: req.params.notice_id } });
    const notificationInfo = await Notification.findOne({
      content_id: req.params.notice_id,
      notification_kind: 'new_notice',
    });
    console.log('@@@', notificationInfo);
    const { notice_id, title, content, createdAt, updatedAt } = noticeDetailInfo;
    if (noticeDetailInfo) {
      res.status(200).send({ notice_id, title, content, createdAt, updatedAt, notification_id: notificationInfo?._id });
    } else {
      res.status(400).send({ message: '존재하지 않는 공지사항입니다.' });
    }
  } catch (err) {
    console.log(err);
    // 에러 처리 로직 추가
    res.status(500).send({ message: '서버 오류가 발생했습니다.' });
  }
};
