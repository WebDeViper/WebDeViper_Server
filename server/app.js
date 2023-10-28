const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env;
const express = require('express');
const { sequelize } = require('./models/index');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://localhost:3000'], // 허용할 도메인
    credentials: true, // 쿠키를 사용하려면 true로 설정
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // 서버에서 클라이언트로 응답을 보낼 때, 쿠키를 설정하려면 Express 응답 객체(res.cookie())를 사용할 수 있도

//삭제 예정
app.set('view engine', 'ejs');
app.use('/views', express.static(__dirname + '/views'));
app.use('/static', express.static(__dirname + '/static'));
/////////

app.use('/', indexRouter);

// 에러처리 하는 미들웨어를 사용하는걸로 업그레이드 해보기..
app.get('*', (req, res) => {
  res.send('404미들웨어');
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
