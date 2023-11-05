const axios = require('axios');
const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_REDIRECT_URL, NAVER_STATE } = process.env;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } = process.env;
const { generateJwtToken, generateRefreshToken } = require('../utils/jwt');
const { User, mongoose } = require('../schemas/schema');

// 네이버 로그인 창으로 리다이렉트 시킴
exports.getNaverOAuth = async (req, res) => {
  try {
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URL}&state=${NAVER_STATE}`;
    res.send(`
        <h1>네이버 Log in</h1>
        <a href="${naverLoginUrl}">Log in</a>
    `);
    // res.redirect(naverLoginUrl);
  } catch (err) {
    res.status(401).send(err);
  }
};

// 네이버 로그인 결과를 받음
exports.getNaverLoginResult = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;

    // 네이버 OAuth 서버로 POST 요청 보내기 (토큰 발급 요청)
    const naverApiUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;
    const tokenResponse = await axios.get(naverApiUrl, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    // 발급받은 토큰 저장
    const accessToken = tokenResponse.data.access_token;

    // 액세스 토큰으로 유저정보 요청
    const userInfoResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log(userInfoResponse.data)
    // {
    // "resultcode":"00",
    // "message":"success",
    // "response":{
    //     "id":"7bvETqfH2_eL9tTtDAqFI8ejYYOGepMtlLEk1zaJjO4",
    //     "email":"edcba1234@naver.com" // 없을수도 있음(필수아니라)
    //     }
    // }

    // 여기까지 온거면 네이버한테 유저정보 받은것
    // 네이버 유저정보로 회원 조회
    const profile = userInfoResponse.data.response;

    // >>> 까지 프론트
    ///////////////
    // >>>> profile 받아서 백엔드

    const exUser = await User.findOne({
      sns_id: profile.id,
      provider: 'naver',
    });

    let userInfo = {
      id: null,
      category: null,
      nickName: null,
      profileImg: null,
      email: null,
      statusMsg: null,
      isServiceAdmin: null,
    };

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
        provider: 'naver',
        email: profile?.email, // profile에 email 필수 아니라 undefinded 일수 있음
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
    // 로그인 처리를 하기위해 jwt 발급(액세스 토큰)
    const token = generateJwtToken(userInfo); // 만료 30분
    // 리프레시 토큰 발급
    const refreshToken = generateRefreshToken(userInfo.id); // 만료 12시간

    return res.send({
      token,
      refreshToken,
      userInfo,
    });
  } catch (err) {
    res.status(401).send(err);
  }
};

// 구글 로그인 창으로 리다이렉트 시킴
exports.getGoogleOAuth = async (req, res) => {
  try {
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URL}&response_type=code&scope=email profile`;
    res.send(`
            <h1> 구글 Log in</h1>
            <a href="${googleLoginUrl}">Log in</a>
            `);
    // res.redirect(naverLoginUrl);
  } catch (err) {
    res.status(401).send(err);
  }
};

// 구글 로그인 결과를 받음
exports.getGoogleLoginResult = async (req, res) => {
  try {
    const { code } = req.query;
    // code로 구글에 액세스토큰 받아오기
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    });

    // 구글한테 받은 토큰 저장
    const accessToken = tokenResponse.data.access_token;

    // 토큰으로 구글 계정정보 가져오기
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log(userInfoResponse.data);
    // {
    //     id: '105652119178569077271',
    //     email: 'rlaxorbs159@gmail.com',
    //     verified_email: true,
    //     name: '김태균',
    //     given_name: '태균',
    //     family_name: '김',
    //     picture: 'https://lh3.googleusercontent.com/a/ACg8ocJuOy4lMD5ENoQAYzmYRRi0Vd4IbC0j83SXSRBFhnLv=s96-c',
    //     locale: 'ko'
    //   }

    // 여기까지 온거면 구글한테 유저정보 받은것
    // 구글 유저정보로 회원 조회
    const profile = userInfoResponse.data;

    const exUser = await User.findOne({
      sns_id: profile.id,
      provider: 'google',
    });

    let userInfo = {
      id: null,
      category: null,
      nickName: null,
      profileImg: null,
      email: null,
      statusMsg: null,
      isServiceAdmin: null,
    };

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
        provider: 'google',
        email: profile?.email, // profile에 email 필수 아니라 undefinded 일수 있음
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
    // 로그인 처리를 하기위해 jwt 발급(액세스 토큰)
    const token = generateJwtToken(userInfo); // 만료 30분
    // 리프레시 토큰 발급
    const refreshToken = generateRefreshToken(userInfo.id); // 만료 12시간

    return res.send({
      token,
      refreshToken,
      userInfo,
    });
  } catch (err) {}
};

// 리프레시 토큰을 확인하고 액세스 토큰을 재발급 해줌
exports.refreshAccessToken = async (req, res) => {
  try {
    // 리프레시 토큰을 검증하고 넘어옴

    // 새로운 액세스 토큰을 발급해서 응답값으로 넘겨주기
    const userId = res.locals.decoded.userInfo;
    const exUser = await User.findById(userId);
    const userInfo = {
      id: exUser._id,
      category: exUser.user_category_name,
      nickName: exUser.nick_name,
      profileImg: exUser.user_profile_image_path,
      email: exUser?.email,
      statusMsg: exUser.status_message,
      isServiceAdmin: exUser.is_service_admin,
    };

    // 액세스 토큰 재발급
    const accessToken = generateJwtToken(userInfo);
    res.send({
      accessToken,
      userInfo,
    });
  } catch (err) {
    res.status(500).send({
      msg: '액세스토큰 재발급 중 서버 에러 발생',
    });
  }
};
