const { User } = require('../models');
const { duplicateCheck } = require('../utils/userModelDuplicateCheck');
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

      // 회원가입 하고 로그인 처리
      const token = generateJwtToken(newUser);
      return res.send({
        token,
        userInfo: {
          id: newUser.user_id,
          category: newUser.category,
          nickName: newUser.nick_name,
          profileImg: newUser.user_profile_image_path,
          email: newUser.email,
        },
      }); // 카테고리 값이 null 일것임, 카테고리&닉네임 선택페이지로 넘겨야함
    }

    // 회원가입 이력 있는유저 로그인 처리
    const token = generateJwtToken(exUser);
    return res.send({
      token,
      userInfo: {
        id: exUser.user_id,
        category: exUser.category,
        nickName: exUser.nick_name,
        profileImg: exUser.user_profile_image_path,
        email: exUser.email,
      },
    });
  } catch (err) {
    console.log('err');
    res.status(500).send(err);
  }
};

// 카카오유저 로그아웃 (새로운 JWT를 발급하고, 기존의 JWT를 무효화하는 방식)
// /api/user/kakao/logout
exports.kakaoLogout = (req, res) => {
  const logoutToken = generateLogoutToken();
  res.send({
    logoutToken,
  });
};

// GET
// 유저 기본정보 조회
// api/user
// http://localhost:8001/api/user
exports.getUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;

    const result = await User.findByPk(currentUserId);

    res.status(200).send({
      userInfo: {
        id: result.user_id,
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

// 유저 정보 수정 ( nickName, category, statusMessage )
// api/user/profile
exports.patchUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;

    const { nickName, category, statusMsg } = req.body;

    const user = await User.findByPk(currentUserId);

    if (nickName) {
      user.nick_name = nickName;
    }
    if (category) {
      user.user_category_name = category;
    }
    if (statusMsg) {
      user.status_message = statusMsg;
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
// POST
// api/user/profile/img
exports.userProfileImgUpload = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;

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
      profileImg: path,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      msg: 'SERVER ERROR',
      error,
    });
  }
};

// 유저 닉네임 중복 체크
// GET
// api/user/nick/:nick/duplicateCheck
exports.userNickDuplicateCheck = async (req, res) => {
  try {
    // 닉네임 중복확인
    const isDuplicate = duplicateCheck(nick_name, req.params.nickName);

    res.send(isDuplicate);
  } catch (error) {
    res.status(500).send({
      success: false,
      msg: 'SERVER ERROR',
      error,
    });
  }
};

// 일반 회원가입
exports.localJoin = async (req, res) => {
  try {
    const email = req.body || 'test@example.com';
    const password = req.body || '1234';

    const isDuplicate = duplicateCheck(email, email);

    if (isDuplicate) {
      return res.status(409).send({ msg: '이메일 중복' });
    }

    await User.create({ email, password });
  } catch (err) {
    res.status(500).send();
  }
};

// 일반 회원탈퇴
exports.localDrop = async (req, res) => {
  try {
    const email = req.body || 'test@example.com';
    const password = req.body || '1234';
  } catch (err) {
    res.status(500).send();
  }
};

// 일반 로그인
exports.localAuth = async (req, res) => {};

// 일반 로그아웃(비검증 JWT를 발급해서 보냄)
exports.localLogout = async (req, res) => {};
