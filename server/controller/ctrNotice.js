const { Notice, User, Sequelize } = require('../models');
exports.getNotice = async (req, res) => {
  try {
    const result = await Notice.findAll();
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};
exports.postNotice = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '2';
    const user = await User.findOne({ where: { user_id: currentUserId } });
    console.log(user);
    if (user.is_admin === 'y') {
      console.log(req.body);
      const result = await Notice.create({
        title: req.body.title,
        content: req.body.content,
        date: Date.now(),
      });
      console.log('result', result);
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
    // const currentUserId = '1';
    const user = await User.findOne({ where: { user_id: currentUserId } });

    console.log(req.query.notice_id);
    console.log(req.body);
    if (user.is_admin === 'y') {
      if (req.query.notice_id) {
        const result = await Notice.update(
          { title: req.body.title, content: req.body.content },
          {
            where: {
              notice_id: req.query.notice_id,
            },
          }
        );
        const data = await Notice.findOne({ where: { notice_id: req.query.notice_id } });

        // console.log('과연 찾았을까?', result);
        res.status(201).send({ status: 'success', data, message: '공지사항이 성공적으로 업데이트 되었습니다.' });
      } else {
        res.status(403).send({ message: '공지사항 수정 권한이 없습니다.' });
      }
    } else {
      res.status(400).send({ status: 'fail', message: '존재하지 않는 공지사항입니다.' });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.deleteNotice = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '1';
    const user = await User.findOne({ where: { user_id: currentUserId } });
    console.log(req.query.notice_id);
    if (user.is_admin === 'y') {
      if (req.query.notice_id) {
        const result = await Notice.destroy({ where: { notice_id: req.query.notice_id } });
        if (result) {
          res.status(204).send({ message: '공지사항이 성공적으로 삭제되었습니다!' });
        } else {
          res.status(400).send({ message: '잘못된 요청입니다.' });
        }
      }
    } else {
      res.status(403).send({ message: '공지사항 삭제권한이 없습니다.' });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.getNoticeDetail = async (req, res) => {
  try {
    // console.log(req.params);
    const noticeDetailInfo = await Notice.findOne({ where: { notice_id: req.params.notice_id } });
    // console.log(noticeDetailInfo);
    res.status(200).send(noticeDetailInfo);
  } catch (err) {
    console.log(err);
  }
};
