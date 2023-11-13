const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env;
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const express = require('express');
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
    origin: process.env.NODE_ENV !== 'production' ? true : ['http://13.124.233.17', 'https://13.124.233.17'],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // 서버에서 클라이언트로 응답을 보낼 때, 쿠키를 설정하려면 Express 응답 객체(res.cookie())를 사용할 수 있도

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
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.NODE_ENV !== 'production' ? true : ['http://13.124.233.17', 'https://13.124.233.17'] },
});
//소켓 커넥션 연결
require('./sockets/io')(io); //채팅
require('./sockets/timer')(io); //타이머
app.listen(PORT, () => {
  console.log(`server open on port ${PORT}`);
});
