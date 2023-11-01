const { User } = require('../models');
const { duplicateCheck } = require('../utils/userModelDuplicateCheck');
const { generateJwtToken } = require('../utils/jwt');

// 카카오유저 로그인 or 회원가입 시키고 로그인
// /api/user/kakao
exports.kakaoAuth = async (req, res) => {
  try {
    const profile = req.body;
    // console.log('/api/user/kakao >>>', profile);

    const exUser = await User.findOne({
      where: { sns_id: profile.id, provider: 'kakao' },
    });
    // console.log(exUser);
    // 응답값으로 보낼 userInfo 초기화
    let userInfo = {
      id: null,
      category: null,
      nickName: null,
      profileImg: null,
      email: null,
    };

    // 회원가입 여부에 따라 userInfo 세팅
    if (exUser) {
      // 이미 회원가입이 되어있으니 그걸로 userInfo 세팅
      userInfo = {
        id: exUser.user_id,
        category: exUser.user_category_name,
        nickName: exUser.nick_name,
        profileImg: exUser.user_profile_image_path,
        email: exUser.email,
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
        id: newUser.user_id,
        category: newUser.user_category_name,
        nickName: newUser.nick_name,
        profileImg: newUser.user_profile_image_path,
        email: newUser.email,
      };
    }

    // 로그인 처리를 하기위해 jwt 발급
    const token = generateJwtToken(userInfo);
    return res.send({
      token,
      userInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// 카카오 유저 회원 탈퇴
// /api/user/kakao/remove
exports.deleteKakaoUser = async (req, res) => {
  // 클라이언트에서 유저<-->카카오 간의 연결을 끊은 다음(로그아웃 개념아님) 수행될 로직. 확인 없이 삭제처리만 하면됨

  try {
    const currentUserId = res.locals.decoded.userInfo.id;

    // 반환 값은 삭제된 레코드의 수
    const result = await User.destroy({
      where: { user_id: currentUserId },
    });

    if (result) {
      // 정상적으로 회원탈퇴
      const logoutToken = generateLogoutToken();
      return res.send({
        logoutToken,
      });
    } else {
      return res.status(409).send({
        msg: '데이터베이스에 삭제된 데이터 없음',
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
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
      // 닉네임 중복검사
      const isDuplicate = duplicateCheck(User, 'nick_name', nickName);
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
      id: result.user_id,
      category: result.user_category_name,
      nickName: result.nick_name,
      profileImg: result.user_profile_image_path,
      email: result.email,
      statusMsg: result.status_message,
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

// 유저 프로필 이미지 업로드
// POST
// api/user/profile/img
exports.userProfileImgUpload = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = 2;

    // 서버에 저장된 파일 이름
    const { filename } = req.file;
    // path == 이미지를 받을 수 있는 URL
    const path = `/api/static/profileImg/${filename}`;

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

// 유저 닉네임 중복 체크
// GET
// api/user/nick/:nick/duplicateCheck
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

// 일반 회원가입
exports.localJoin = async (req, res) => {
  try {
    const email = req.body || 'test@example.com';
    const password = req.body || '1234';

    const isDuplicate = duplicateCheck(User, email, email);

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
