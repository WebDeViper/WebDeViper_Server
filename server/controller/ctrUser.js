// const { duplicateCheck } = require('../utils/userModelDuplicateCheck');
const { generateJwtToken, generateRefreshToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/bcrypt');

// 시퀄라이즈 모듈 불러오기
const { User } = require('../models/index');
const { Op } = require('sequelize');

// 받은 유저아이디로 유저정보를 반환하는 API
// api/user/:id
exports.getUserInfo = async (req, res) => {
  try {
    const targetUser = req.params.userId;

    const userInfo = await User.findById(targetUser);
    console.log('파람스로 받은 유저정보 조회 >> ', userInfo);
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
    // console.log(currentUserId);
    const result = await User.findById(currentUserId);

    res.status(200).send({
      userInfo: {
        id: result._id,
        category: result.user_category_name,
        nickName: result.nick_name,
        profileImg: result.user_profile_image_path,
        email: result.email,
        statusMsg: result.status_message,
        isServiceAdmin: result.is_service_admin,
      },
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      msg: 'SERVER ERROR',
      errorData: err,
    });
  }
};

// 소셜 로그인 or 회원가입 시키고 로그인
// /api/user/join
exports.join = async (req, res) => {
  try {
    const profile = req.body;

    const exUser = await User.findOne({
      sns_id: profile.id,
      provider: profile.provider,
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
        id: exUser._id,
        category: exUser.user_category_name,
        nickName: exUser.nick_name,
        profileImg: exUser.user_profile_image_path,
        email: exUser.email,
        statusMsg: exUser.status_message,
        isServiceAdmin: exUser.is_service_admin,
      };
    } else {
      // 가입이력이 없으니 회원가입 처리 하기 위해 DB에 저장하고 그걸로 userInfo 세팅
      let newUser = {};

      if (profile.provider === 'kakao') {
        newUser = await User.create({
          sns_id: profile.id,
          provider: profile.provider,
          email: profile.kakao_account?.email,
        });
      } else if (profile.provider === 'naver') {
        newUser = await User.create({
          sns_id: profile.id,
          provider: profile.provider,
          email: profile?.email,
        });
      } else if (profile.provider === 'google') {
        newUser = await User.create({
          sns_id: profile.id,
          provider: profile.provider,
          email: profile?.email,
        });
      } else if (profile.provider === 'test') {
        newUser = await User.create({
          sns_id: profile.id,
          provider: profile.provider,
          email: profile?.email,
          is_service_admin: profile.isServiceAdmin,
        });
      }
      // userInfo 세팅
      userInfo = {
        id: newUser._id,
        category: newUser.user_category_name,
        nickName: newUser.nick_name,
        profileImg: newUser.user_profile_image_path,
        email: newUser.email,
        statusMsg: newUser.status_message,
        isServiceAdmin: newUser.is_service_admin,
      };
    }

    // 로그인 처리를 하기위해 jwt 발급
    const token = generateJwtToken(userInfo); // 만료 2시간
    // 리프레시 토큰 발급
    const refreshToken = generateRefreshToken(userInfo.id); // 만료 12시간

    return res.send({
      token,
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

    // 닉네임의 중복만 확인한다.
    const nickDuplicate = await User.findAll({ where: { nick_name: nickName } });
    if (nickDuplicate.length !== 0) {
      console.log('이미 해당 닉네임이 있음');
      return res.status(409).send({
        message: '이미 존재하는 닉네임 입니다.',
      });
    }

    // 패스워드 암호화
    const hashedPassword = hashPassword(password);
    console.log('>>>>>>', hashedPassword);

    // 데이터베이스에 유저 정보 저장
    let userInfo = {
      email: email,
      password: hashedPassword,
      nick_name: nickName,
      category: category,
    };
    const newUser = await User.create(userInfo);

    // 성공 응답을 전달합니다.
    res.send({
      isSuccess: true,
      message: '회원가입 처리 성공',
    });
  } catch (err) {
    res.status(500).send({
      message: '회원가입 처리 중 서버에러 발생',
    });
  }
};

// local 로그인
// /api/user/login
exports.login = async (req, res) => {
  // 요청 본문의 null 검사
  if (!req.body.email || !req.body.password) {
    return res.status(404).send({
      message: '요청값이 비었습니다.',
    });
  }

  // 이메일과 패스워드를 받는다
  const { email, password } = req.body;

  // DB에 조회
  const exUser = await User.findAll({
    where: { email },
  });

  // 이메일 확인
  if (exUser.length === 0) {
    return res.status(409).send({
      isSuccess: false,
      message: '이메일 오류',
    });
  }

  // 암호 확인
  let passCheck;
  for (const user of exUser) {
    passCheck = comparePassword(password, user.password);
  }

  if (!passCheck) {
    return res.status(409).send({
      isSuccess: false,
      message: '패스워드 오류',
    });
  }

  // 토큰 생성
  // userInfo 세팅
  const payload = {
    id: exUser.user_id,
    category: exUser.category,
    nickName: exUser.nick_name,
    profileImg: exUser.image_path,
    email: exUser.email,
    statusMsg: exUser.status_message,
    isServiceAdmin: exUser.is_admin,
  };

  // 로그인 처리를 하기위해 jwt 발급
  const accessToken = generateJwtToken(payload);
  // 리프레시 토큰 발급
  const refreshToken = generateRefreshToken(payload.id); // 만료 12시간

  // 응답값 전송
  res.send({
    isSuccess: true,
    message: '로그인 처리 성공',
    userInfo: exUser,
    accessToken,
    refreshToken,
  });
};

// 유저 정보 수정 ( nickName, category, statusMessage )
// 유저정보 수정하면 다시 토큰생성해서 보냄
// api/user/profile
exports.patchUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544cc034f18de981a274777';

    const { nickName, category, statusMsg } = req.body;

    let user = await User.findById(currentUserId);

    if (nickName) {
      // 닉네임 중복검사
      const isDuplicate = await duplicateCheck(User, 'nick_name', nickName);

      if (isDuplicate) {
        return res.status(409).send({
          msg: '닉네임이 이미 존재합니다.',
        });
      }

      // TODO 1
      // 만약 그룹스키마의 join_requests에 user_id와 현재 유저의 _id가 같은게 있다면
      // join_requests의 user_name 값도 최신화 해줘야 한다.
      const pendingGroup = await User.findById(currentUserId).select('pending_groups');

      for (let group of pendingGroup.pending_groups) {
        const groupId = group.group; // 그룹 ID
        console.log('그룹 ID >> ', groupId);

        // Group스키마의 join_requests를 조회
        const groupData = await Group.findById(groupId);
        console.log('Group스키마의 join_requests를 조회', groupData);

        // join_requests 배열의 요소들을 순회하면서 user_id와 현재 유저의 _id를 비교
        for (let joinRequest of groupData.join_requests) {
          console.log('joinRequest 순회', joinRequest);
          if (joinRequest.user_id.toString() === currentUserId) {
            // 일치하는 경우 user_name 필드 업데이트
            joinRequest.user_name = nickName;

            // Group스키마 업데이트
            await groupData.save();
            console.log('Group스키마 업데이트', groupData);
          }
        }
      }

      // TODO 2
      // 만약 chat스키마의 user 필드에 user_id와 현재 유저의 _id가 같은게 있다면 user의 name 값도 최신화 해줘야 한다.
      Chat.updateMany({ 'user.user_id': currentUserId }, { $set: { 'user.name': nickName } });

      user.nick_name = nickName;
    }
    if (category) {
      user.user_category_name = category;
    }
    if (statusMsg) {
      user.status_message = statusMsg;
    }

    const result = await user.save();

    const userInfo = {
      id: result._id,
      category: result.user_category_name,
      nickName: result.nick_name,
      profileImg: result.user_profile_image_path,
      email: result.email,
      statusMsg: result.status_message,
      isServiceAdmin: result.is_service_admin,
    };

    // 변경된 userInfo로 jwt 재생성
    const token = generateJwtToken(userInfo);

    // 토큰과 함께 변경된 유저정보 전달
    res.status(200).send({
      token,
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
    const isDuplicate = await duplicateCheck(User, 'nick_name', req.params.nickName);

    res.send(isDuplicate);
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: 'SERVER ERROR',
      error,
    });
  }
};

// 유저 프로필 이미지 업로드
// POST
// api/user/profile/img
exports.userProfileImgUpload = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544cc034f18de981a274777';
    // 서버에 저장된 파일 이름
    const { filename } = req.file;
    // path == 이미지를 받을 수 있는 URL
    const path = `/api/static/profileImg/${filename}`;

    // 이미지 경로 수정해서 토큰 재생성
    // 응답값에 전달하고 리액트에서 상태관리 하면 될듯

    // user 테이블에 이미지 경로 저장
    await User.updateOne({ _id: currentUserId }, { user_profile_image_path: path });

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
