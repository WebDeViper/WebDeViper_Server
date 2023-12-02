const { duplicateCheck } = require('../utils/userModelDuplicateCheck');
const { generateJwtToken, generateRefreshToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { Notification, mongoose } = require('../schemas/schema');
// 시퀄라이즈 모듈 불러오기
const { User, UserGroupRelation, Sequelize, Group } = require('../models/index');
const { Op } = require('sequelize');

// 로컬 유저 이메일 중복 체크(회원가입시)
// api/user/email/:email/duplicateCheck
exports.emailDuplicateCheck = async (req, res) => {
  try {
    // 이메일의 중복 확인한다.
    const emailDuplicate = await User.count({
      where: {
        [Op.and]: [{ provider: 'local' }, { email: req.params.email }],
      },
    });

    const result = emailDuplicate !== 0;

    res.send({
      isSuccess: true,
      isDuplicate: result,
    });
  } catch (err) {
    res.status(500).send({
      isSuccess: false,
      message: '서버 에러 발생',
    });
  }
};

// 받은 유저아이디로 유저정보를 반환하는 API
// api/user/:id
exports.getUserInfo = async (req, res) => {
  try {
    const targetUser = req.params.userId;

    const userInfo = await User.findByPk(targetUser);

    res.send({
      isSuccess: true,
      message: '유저 정보 조회 성공',
      userInfo,
    });
  } catch (err) {
    res.status(500).send({
      isSuccess: false,
      message: '유저 조회 실패',
    });
  }
};

// 유저 기본정보 조회(본인)
// api/user
exports.getUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    const exUser = await User.findOne({ where: { user_id: currentUserId } });

    // 유저에게 필요한 notification 전체 불러오기
    const notifications = await Notification.find({
      $or: [{ user_id: currentUserId }, { user_id: 'admin' }],
      read_user_id: { $ne: currentUserId },
      is_read: 'n',
    });

    // 'group_request', 'group_approve', 'group_rejection'인 경우 user_id를 변경
    const modifiedNotifications = await Promise.all(
      notifications.map(async notification => {
        if (notification.notification_kind === 'group_request') {
          const requestUser = await UserGroupRelation.findAll({
            where: { group_id: notification.group_id, request_status: 'w' },
            order: [['updatedAt', 'DESC']],
            limit: 1,
          });
          if (requestUser.length) {
            console.log(requestUser, '요청한 유저!');
            const requestUserId = requestUser[0].dataValues.user_id;
            console.log('^^^^^', requestUserId);
            const requestUserInfo = await User.findOne({ where: { user_id: requestUserId } });
            console.log(requestUserInfo, 'adfafda');
            notification.user_id = requestUserInfo.dataValues.nick_name;
            console.log('notification.user_id ', notification.user_id);
          }
        } else if (
          notification.notification_kind === 'group_approve' ||
          notification.notification_kind === 'group_rejection'
        ) {
          // 'group_approve' 또는 'group_rejection'인 경우에 대한 처리
          const requestGroupInfo = await Group.findOne({ where: { group_id: notification.group_id } });
          const requestGroupLeaderInfo = await User.findOne({
            where: { user_id: requestGroupInfo.dataValues.leader_id },
          });
          const requestGroupLeaderNickname = requestGroupInfo.dataValues.nick_name;
          notification.user_id = requestGroupLeaderNickname;
        }
        return notification;
      })
    );

    console.log(modifiedNotifications);
    res.status(200).send({
      userInfo: {
        id: exUser.user_id,
        category: exUser.category,
        nickName: exUser.nick_name,
        profileImg: exUser.image_path,
        email: exUser.email,
        statusMsg: exUser.status_message,
        isServiceAdmin: exUser.is_admin,
        alarmMessage: modifiedNotifications,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      code: 500,
      msg: 'SERVER ERROR',
    });
  }
};

// 카카오 계정 로그인/회원가입
// /api/user/kakaologin
exports.kakaologin = async (req, res) => {
  try {
    const profile = req.body;

    const exUser = await User.findOne({
      where: { sns_id: profile.id },
    });

    // 응답값으로 보낼 userInfo 초기화
    let userInfo = {
      id: null,
      category: null,
      nickName: null,
      profileImg: null,
      email: null,
      statusMsg: null,
      isServiceAdmin: null,
    };

    // 회원가입 여부에 따라 userInfo 세팅
    if (exUser) {
      // 이미 회원가입이 되어있으니 그걸로 userInfo 세팅
      userInfo = {
        id: exUser.user_id,
        category: exUser.category,
        nickName: exUser.nick_name,
        profileImg: exUser.image_path,
        email: exUser.email,
        statusMsg: exUser.status_message,
        isServiceAdmin: exUser.is_admin,
      };
    } else {
      // 가입이력이 없으니 회원가입 처리 하기 위해 DB에 저장하고 그걸로 userInfo 세팅
      let newUser = await User.create({
        sns_id: profile.id,
        provider: 'kakao',
        email: profile.kakao_account?.email,
      });

      // userInfo 세팅
      userInfo = {
        id: newUser.user_id,
        category: newUser.category,
        nickName: newUser.nick_name,
        profileImg: newUser.image_path,
        email: newUser.email,
        statusMsg: newUser.status_message,
        isServiceAdmin: newUser.is_admin,
      };
    }

    // 로그인 처리를 하기위해 jwt 발급
    const accessToken = generateJwtToken(userInfo);
    // 리프레시 토큰 발급
    const refreshToken = generateRefreshToken(userInfo.id); // 만료 12시간

    return res.send({
      token: accessToken,
      refreshToken,
      userInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// local 회원가입
// /api/user/register
exports.registerUser = async (req, res) => {
  try {
    // 요청 본문의 null 검사
    if (!req.body.email || !req.body.password || !req.body.nickName || !req.body.category) {
      return res.status(404).send({
        message: '요청값이 비었습니다.',
      });
    }

    // 요청 본문으로
    // 유저 이메일, 패스워드, 닉네임, 카테고리를 받는다.
    const { email, password, nickName, category } = req.body;

    // 닉네임의 중복 확인한다.
    const nickDuplicate = await User.count({
      where: {
        [Op.and]: [{ provider: 'local' }, { nick_name: nickName }],
      },
    });
    if (nickDuplicate !== 0) {
      console.log('이미 해당 닉네임이 있음');
      return res.status(409).send({
        isSuccess: false,
        message: '이미 존재하는 닉네임 입니다.',
      });
    }

    // 이메일의 중복 확인한다.
    const emailDuplicate = await User.count({
      where: {
        [Op.and]: [{ provider: 'local' }, { email: email }],
      },
    });
    if (emailDuplicate !== 0) {
      console.log('이미 해당 이메일이 있음');
      return res.status(409).send({
        isSuccess: false,
        message: '이미 존재하는 이메일 입니다.',
      });
    }

    // 패스워드 암호화
    const hashedPassword = hashPassword(password);

    // 데이터베이스에 유저 정보 저장
    let userInfo = {
      email: email,
      password: hashedPassword,
      nick_name: nickName,
      category: category,
      provider: 'local',
    };
    const newUser = await User.create(userInfo);

    // 성공 응답을 전달합니다.
    res.send({
      isSuccess: true,
      message: '회원가입 처리 성공',
    });
  } catch (err) {
    res.status(500).send({
      isSuccess: false,
      message: '회원가입 처리 중 서버에러 발생',
    });
  }
};

// local 로그인
// /api/user/login
exports.login = async (req, res) => {
  try {
    // 요청 본문의 null 검사
    if (!req.body.email || !req.body.password) {
      return res.status(404).send({
        isSuccess: false,
        message: '요청값이 비었습니다.',
      });
    }

    // 이메일과 패스워드를 받는다
    const { email, password } = req.body;

    // DB에 조회
    const exUser = await User.findOne({
      where: {
        [Op.and]: [{ provider: 'local' }, { email: email }],
      },
    });

    // 이메일 확인
    if (!exUser) {
      return res.status(409).send({
        isSuccess: false,
        message: '찾을 수 없는 이메일 입니다.',
      });
    }

    // 암호 확인
    let passCheck = comparePassword(password, exUser.password);
    if (!passCheck) {
      return res.status(409).send({
        isSuccess: false,
        message: '패스워드 오류',
      });
    }

    let userInfo = {
      id: exUser.user_id,
      category: exUser.category,
      nickName: exUser.nick_name,
      profileImg: exUser.image_path,
      email: exUser.email,
      statusMsg: exUser.status_message,
      isServiceAdmin: exUser.is_admin,
    };

    // 로그인 처리를 하기위해 jwt 발급
    const accessToken = generateJwtToken(userInfo);
    // 리프레시 토큰 발급
    const refreshToken = generateRefreshToken(userInfo.id); // 만료 12시간

    // 응답값 전송
    res.send({
      isSuccess: true,
      message: '로그인 처리 성공',
      userInfo: userInfo,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).send({
      isSuccess: false,
      message: '로그인 처리 중 서버에러 발생',
    });
  }
};

// 유저 정보 수정 ( nickName, category, statusMessage )
// 유저정보 수정하면 다시 토큰생성해서 보냄
// api/user/profile
exports.patchUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = 'd885213b-030f-4bb8-a196-363f44a04a4f';
    // console.log('>>>>', currentUserId);
    const { nickName, category, statusMsg } = req.body;

    let user = await User.findByPk(currentUserId);

    if (nickName) {
      // 닉네임 중복검사
      const isDuplicate = await duplicateCheck(User, 'nick_name', nickName);
      console.log('중복임? @@', isDuplicate);
      if (isDuplicate) {
        return res.status(409).send({
          isSuccess: false,
          msg: '닉네임이 이미 존재합니다.',
        });
      }
      user.nick_name = nickName;
    }
    if (category) {
      user.category = category;
    }
    if (statusMsg) {
      user.status_message = statusMsg;
    }
    await user.save();
    const userInfo = {
      id: user.user_id,
      category: user.category,
      nickName: user.nick_name,
      profileImg: user.image_path,
      email: user.email,
      statusMsg: user.status_message,
      isServiceAdmin: user.is_admin,
    };

    // 변경된 userInfo로 jwt 재생성
    const accessToken = generateJwtToken(userInfo);

    // 토큰과 함께 변경된 유저정보 전달
    res.status(200).send({
      isSuccess: true,
      token: accessToken,
      userInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      isSuccess: false,
      code: 500,
      msg: 'SERVER ERROR',
    });
  }
};

exports.userNickDuplicateCheck = async (req, res) => {
  try {
    // 닉네임 중복확인
    const result = await duplicateCheck(User, 'nick_name', req.params.nickName);

    res.send({
      isSuccess: true,
      isDuplicate: result,
    });
  } catch (error) {
    console.err(error);
    res.status(500).send({
      isSuccess: false,
      message: 'SERVER ERROR',
    });
  }
};

// 유저 프로필 이미지 업로드
// POST
// api/user/profile/img
exports.userProfileImgUpload = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;

    // 서버에 저장된 파일 이름
    const { filename } = req.file;
    // path == 이미지를 받을 수 있는 URL
    const path = `/api/static/profileImg/${filename}`;

    // user 테이블에 이미지 경로 저장
    await User.update({ image_path: path }, { where: { user_id: currentUserId } });

    // 업로드 성공 응답
    res.status(200).send({
      msg: '파일이 성공적으로 업로드되었습니다.',
      profileImg: path,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: 'SERVER ERROR',
      err,
    });
  }
};

//로그인한 유저의 상태메시지를 조회
exports.userStatus = async (req, res) => {
  try {
    // const currentUserId = res.locals.decoded.userInfo.id;
    const currentUserId = 'd4cfc232-da15-4919-8ac7-b3e183d05c35';

    const userInfo = await User.findByPk(currentUserId);

    if (userInfo && userInfo.status_message) {
      res.status(200).send({
        isSuccess: true,
        statusMessage: userInfo.status_message,
      });
    } else {
      //상태메시지 없을 때
      res.status(200).send({
        isSuccess: true,
        statusMessage: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      msg: 'SERVER ERROR',
      err,
    });
  }
};

//로그인한 유저의 상태메시지를 업데이트
exports.updateStatus = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    const userInfo = await User.findByPk(currentUserId);

    if (!userInfo) {
      return res.status(404).json({
        isSuccess: false,
        msg: 'User not found',
      });
    }

    const { statusMessage } = req.body;
    userInfo.status_message = statusMessage;
    await userInfo.save();

    res.status(200).send({
      isSuccess: true,
      msg: 'User status updated successfully',
      data: userInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      isSuccess: false,
      msg: 'SERVER ERROR',
      err,
    });
  }
};
