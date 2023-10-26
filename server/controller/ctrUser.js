const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../utils/jwt');

// 유저 생성
// api/user
exports.userCreate = async (req, res) => {
  try {
    const userEmail = req.body.email || 'testuser';
    const userPassword = req.body.password || 'testuser';

    const exUser = await User.findOne({ where: { email: userEmail } });
    if (exUser) {
      // 이미 존재하는 회원
      if (userEmail === exUser.email) {
        res.status(409).send({
          success: false,
          msg: '이메일 중복',
        });
        return;
      } else {
        res.status(409).send({
          success: false,
          msg: '패스워드 중복',
        });
        return;
      }
    } else {
      const newUser = await User.create({
        email: userEmail,
        password: userPassword,
      });

      res.send({
        success: true,
        msg: '회원가입 성공',
        userData: newUser,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: true,
      msg: '서버에러',
    });
  }
};

// 로그인 시도에 대한 토큰 생성
// api/user/auth
exports.tokenCreate = async (req, res) => {
  try {
    const userEmail = req.body.email || 'testuser';
    const userPassword = req.body.password || 'testuser';

    //
    const exUser = await User.findOne({ where: { email: userEmail } });
    if (exUser) {
      if (userPassword === exUser.password) {
        // 정상 로그인 되었을때 JWT 생성 로직
        // sign({토큰의 내용}, 토큰의 비밀 키, {토큰의 설정})
        // issuer 는 발급자임.
        const token = jwt.sign(
          {
            userInfo: {
              email: exUser.email,
              user_id: exUser.user_id,
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: '10m', issuer: 'APIServer' }
        );

        console.log('컨트롤러 >> 토큰발급 성공 ', token);

        // 쿠키에 jwt를 담아서 보내보자
        res.cookie('jwtToken', token, {
          maxAge: 30 * 60000,
          httpOnly: true,
        });

        res.send({
          success: true,
        });
      } else {
        res.status(401).send({
          success: false,
          msg: 'invalid password',
        });
      }
    } else {
      res.status(401).send({
        success: false,
        msg: 'invalid email',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      msg: '서버에러',
    });
  }
};

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

  // 로그인 성공 응답
  res.send({
    success: true,
    jwtFormat: jwtToken,
  });
};

// GET
// api/user
exports.getUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded?.userInfo?.user_id || 1;

    // ToDO 미들웨어로 대체
    if (!currentUserId) {
      return res.status(401).send({
        msg: '권한 없는 유저',
      });
    }

    const result = await User.findByPk(currentUserId);
    res.send({
      success: true,
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
      error: err,
      msg: 'SERVER ERROR',
    });
  }
};

// 유저 정보 수정 ( nickName, category, statusMessage )
// api/user/profile
exports.patchUser = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded?.userInfo?.user_id || 1;

    // ToDO 미들웨어로 대체
    if (!currentUserId) {
      return res.status(401).send({
        msg: '권한 없는 유저',
      });
    }

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

    res.send({
      success: true,
      msg: '유저정보 수정 처리',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('SERVER ERROR');
  }
};
