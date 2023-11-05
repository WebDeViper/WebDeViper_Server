const { duplicateCheck } = require('../utils/userModelDuplicateCheck');
const { generateJwtToken, generateRefreshToken } = require('../utils/jwt');
// Mongoose
const { User, mongoose } = require('../schemas/schema');
// const ObjectId = mongoose.Types.ObjectId;

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

// 카카오유저 로그인 or 회원가입 시키고 로그인
// /api/user/kakao/mongoose
exports.kakaoAuth = async (req, res) => {
  try {
    const profile = req.body;
    // console.log('/api/user/kakao >>>', profile);

    const exUser = await User.findOne({
      sns_id: profile.id,
      provider: 'kakao',
    });
    // console.log(exUser);
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
      const newUser = await User.create({
        sns_id: profile.id,
        provider: 'kakao',
        email: profile.kakao_account?.email, // profile에 kakao_account 가 없어도 에러가 나지 않음
      });

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
    const token = generateJwtToken(userInfo); // 만료 30분
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

// 유저 정보 수정 ( nickName, category, statusMessage )
// 유저정보 수정하면 다시 토큰생성해서 보냄
// api/user/profile
exports.patchUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544cc034f18de981a274777';

    const { nickName, category, statusMsg } = req.body;

    const user = await User.findById(currentUserId);

    if (nickName) {
      // 닉네임 중복검사
      const isDuplicate = await duplicateCheck(User, 'nick_name', nickName);

      if (isDuplicate) {
        return res.status(409).send({
          msg: '닉네임이 이미 존재합니다.',
        });
      }
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
