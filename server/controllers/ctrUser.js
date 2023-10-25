const { User } = require('../models');
const jwt = require('jsonwebtoken');

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

// 유저정보 수정 PATCH
// api/user/:user_id
exports.userPatch = async (req, res) => {
  try {
    console.log('토큰인증 통과');
    res.send(req);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
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
exports.kakaoLoginTokenCreate = async (req, res) => {};
