const { User } = require('../models');
// const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../utils/jwt');

// 카카오 로그인 성공 처리
exports.kakaoLoginTokenCreate = (req, res) => {
  // 로그인에 성공했을때
  // res.redirect('/');

  // 사용자 정보를 사용하여 JWT 토큰 생성
  const jwtToken = generateJwtToken(req.user);

  // JWT 토큰을 쿠키에 담아 클라이언트에게 반환
  res.cookie('jwtCookie', jwtToken, {
    maxAge: 30 * 60000, // 30m
    httpOnly: true,
  });

  // 로그인 성공 응답 (이경우에는 api서버 본인에게 응답)
  // res.status(200)({
  //   isSuccess: true,
  //   jwtFormat: jwtToken,
  // });

  // 리액트 서버(프론트)로 리다이렉트
  res.redirect(`${process.env.REACT_APP_URL}`);
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
