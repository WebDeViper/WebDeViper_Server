const { Notice, User, mongoose } = require('../schemas/schema');

exports.getNotice = async (req, res) => {
  try {
    // const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544c9106ec46b098ac68132';
    // const isAdmin = await User.findById(currentUserId);
    // console.log(userInfo);
    const result = await Notice.find();
    console.log(result);

    res.status(200).send({ notices: result });
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};

exports.postNotice = async (req, res) => {
  try {
    const notice = new Notice({
      title: req.body.title,
      content: req.body.content,
    });
    await notice.save();
    console.log('result', notice);
    res.send({ result: notice, message: '공지사항이 성공적으로 생성되었습니다.' });
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};

exports.patchNotice = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544c9106ec46b098ac68132';
    // const user = await User.findById(currentUserId);
    // if (user.is_service_admin) {
    console.log(req.query.notice_id);
    console.log(req.body);

    if (req.query.notice_id) {
      const result = await Notice.findByIdAndUpdate(
        req.query.notice_id,
        {
          title: req.body.title,
          content: req.body.content,
          updated_at: new Date(),
        },
        { new: true }
      );
      console.log('과연 찾았을까?', result);
      if (result) {
        res
          .status(200)
          .send({ status: 'success', data: result, message: '공지사항이 성공적으로 업데이트 되었습니다.' });
      } else {
        res.status(400).send({ status: 'fail', message: '존재하지 않는 공지사항입니다.' });
      }
    } else {
      res.status(400).send({ status: 'fail', message: '공지사항 ID가 필요합니다.' });
    }
    // } else {
    //   res.status(400).send({ status: 'fail', message: '공지사항 수정 권한이 없습니다.' });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    // const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544c9106ec46b098ac68132';
    // const user = await User.findById(currentUserId);
    // if (user.is_service_admin) {
    // console.log(req.query.notice_id);
    if (req.query.notice_id) {
      const result = await Notice.deleteOne({ _id: req.query.notice_id });
      // console.log(result);
      // console.log(typeof result.deletedCount);
      // 공지사항이 존재하는 경우
      // { acknowledged: true, deletedCount: 1 }
      // 공지사항이 존재하지 않는 경우
      //{ acknowledged: true, deletedCount: 0 }

      if (result.deletedCount === 1) {
        res.status(200).send({ message: '공지사항이 성공적으로 삭제되었습니다!' });
      } else {
        res.status(400).send({ message: '존재하지 않는 공지사항입니다.' });
      }
    } else {
      res.status(400).send({ message: '공지사항 ID가 필요합니다.' });
    }
    // } else {
    //   res.status(400).send({ message: '공지사항 삭제 권한이 없습니다.' });
    // }
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};

exports.getNoticeDetail = async (req, res) => {
  try {
    const result = await Notice.findById(req.params.notice_id);
    if (result) {
      res.status(200).send({ result, message: '공지사항 찾기 성공!', isAdmin: user.is_service_admin });
    } else {
      res.status(400).send({ message: '존재하지 않는 공지사항입니다.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};
