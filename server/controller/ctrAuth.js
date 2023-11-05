const axios = require('axios');
const { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } = process.env;
// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } = process.env;
const { generateJwtToken, generateRefreshToken } = require('../utils/jwt');
const { User, mongoose } = require('../schemas/schema');

// 프론트한테 요청받고 네이버 유저정보 가져와서 프론트로 전달
// 네이버는 프론트에서 처리하면 CORS떠서 어쩔수 없이 만듬
// api/auth/naver/token
exports.passToken = async (req, res) => {
  try {
    const { code, state } = req.body;

    const naverApiUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;
    const response = await axios.get(naverApiUrl, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });
    const naverTokens = response.data;

    const accessToken = response.data.access_token;
    const userInfoResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const naverUser = userInfoResponse.data;

    res.send({
      naverTokens,
      naverUser,
    });
  } catch (err) {
    res.status(500).send({
      msg: '네이버로부터 토큰 및 정보 받기 실패',
    });
  }
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
