const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const connect = require('./schemas/index');

// cors 미들웨어
app.use(
  cors({
    origin: process.env.NODE_ENV !== 'production' ? true : ['http://13.124.233.17', 'https://13.124.233.17'],
  })
);

// 몽고 DB 연결
connect();

// 소켓 설정
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // 클라이언트 주소
  cors: {
    origin: process.env.NODE_ENV !== 'production' ? true : ['http://13.124.233.17', 'https://13.124.233.17'],
  },
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 소켓 커넥션 연결
require('./utils/io')(io); // 채팅
require('./utils/timer')(io); // 타이머

httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log('server listening on port', process.env.SOCKET_PORT);
});

module.exports = app;
