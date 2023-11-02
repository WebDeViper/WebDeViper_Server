const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env;
const path = require('path');
const express = require('express');
const { sequelize } = require('./models/index');
const connect = require('./schemas/index');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const cors = require('cors');
const app = express();

// 몽고 DB 연결
connect();

// cors 미들웨어
app.use(
  cors({
    // origin: '*',
    origin: true, // 요청을 보내온 origin이 Access-Control-Allow-Origin의 값으로 설정된다
    // origin: ['http://localhost:3000', 'https://localhost:3000'], // 허용할 오리진
    // credentials: true, // 쿠키를 사용하려면 true로 설정
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // 서버에서 클라이언트로 응답을 보낼 때, 쿠키를 설정하려면 Express 응답 객체(res.cookie())를 사용할 수 있도

//삭제 예정
app.set('view engine', 'ejs');
app.use('/views', express.static(__dirname + '/views'));
/////////

// 정적 파일 서빙
app.use('/api/static', express.static(path.join(__dirname, 'static')));

// 라우터
app.use('/', indexRouter);

// 에러처리 하는 미들웨어를 사용하는걸로 업그레이드 해보기..
app.get('*', (req, res) => {
  res.status(404).send({
    reqURL: req.url,
    msg: '요청경로를 찾을 수 없습니다.',
  });
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
