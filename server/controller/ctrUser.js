const { User } = require('../models');
// const jwt = require('jsonwebtoken');
const { generateJwtToken, generateLogoutToken } = require('../utils/jwt');

// 카카오유저 로그인 or 회원가입 시키고 로그인
// /api/user/kakao
exports.kakaoAuth = async (req, res) => {
  try {
    const profile = req.body;
    console.log('/api/user/kakao >>>', profile);

    const exUser = await User.findOne({
      where: { sns_id: profile.id, provider: 'kakao' },
    });

    if (!exUser) {
      // 가입이력이 없으니 회원가입 처리
      const newUser = await User.create({
        email: profile._json?.kakao_account?.email, // profile.email이 undefined 일수도 있음. 중간에 어떤 속성이 존재하지 않는 경우에도 코드는 오류를 발생시키지 않고 undefined를 반환
        sns_id: profile.id,
        provider: 'kakao',
      });

      // 로그인 처리
      const token = generateJwtToken(newUser);
      const { user_id, user_category_name, user_profile_image_path, status_message } = newUser;
      return res.send({
        token,
        user_id,
        user_category_name,
        user_profile_image_path,
        status_message,
      }); // 카테고리 값이 NULL 일것임, 카테고리&닉네임 선택페이지로 넘겨야함
    }

    // 회원가입 이력 있는유저 로그인 처리
    const token = generateJwtToken(exUser);
    const { user_id, user_category_name, user_profile_image_path, status_message } = exUser;
    return res.send({
      token,
      user_id,
      user_category_name,
      user_profile_image_path,
      status_message,
    });
  } catch (err) {
    console.log('err');
    res.status(500).send(err);
  }
};

// 카카오유저 로그아웃 (새로운 JWT를 발급하고, 기존의 JWT를 무효화하는 방식)
// /api/user/kakao/logout
exports.kakaoLogout = (req, res) => {
  const unverifiedToken = generateLogoutToken();
  res.send({
    unverifiedToken,
  });
};

// GET
// api/user
exports.getUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded?.userInfo?.user_id || 1;

    // ToDO 미들웨어로 대체
    // if (!currentUserId) {
    //   return res.status(401).send({
    //     msg: '권한 없는 유저',
    //   });
    // }

    const result = await User.findByPk(currentUserId);
    // console.log(result);

    res.status(200)({
      isSuccess: true,
      code: 200,
      userInfo: {
        userId: result.user_id,
        userCategoryName: result.user_category_name,
        nickName: result.nick_name,
        userProfileImagePath: result.user_profile_image_path,
        statusMessage: result.status_message,
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

// 유저 정보 수정 ( nickName, category, statusMessage )
// api/user/profile
exports.patchUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded?.userInfo?.user_id || 1;

    // ToDO 미들웨어로 대체
    // if (!currentUserId) {
    //   return res.status(401).send({
    //     msg: '권한 없는 유저',
    //   });
    // }

    const { nickName, category, statusMessage } = req.body;

    const user = await User.findByPk(currentUserId);

    if (nickName) {
      user.nick_name = nickName;
    }
    if (category) {
      user.user_category_name = category;
    }
    if (statusMessage) {
      user.status_message = statusMessage;
    }

    await user.save();

    res.status(200)({
      isSuccess: true,
      code: 200,
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

// 유저 프로필 이미지 업로드
exports.userProfileImgUpload = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded?.userInfo?.user_id || 1;

    // ToDO 미들웨어로 대체
    // if (!currentUserId) {
    //   return res.status(401).send({
    //     msg: '권한 없는 유저',
    //   });
    // }

    // path == 이미지를 받을 수 있는 URL
    // originalname == 유저가 업로드한 원본 파일 이름(확장자 포함)
    const { originalname, path } = req.file;

    // 이미지 경로 수정해서 토큰 재생성
    // 응답값에 전달하고 리액트에서 상태관리 하면 될듯

    // user 테이블에 이미지 경로 저장
    await User.update(
      {
        // userImg: originalname,
        user_profile_image_path: path,
      },
      {
        where: {
          user_id: currentUserId,
        },
      }
    );

    // 업로드 성공 응답
    res.status(200).send({
      isSuccess: true,
      code: 200,
      msg: '파일이 성공적으로 업로드되었습니다.',
      userProfileImagePath: path,
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
