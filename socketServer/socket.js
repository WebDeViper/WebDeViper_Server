const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const { createServer } = require('http');
app.use(cors());
const { Server } = require('socket.io');
// const Room = require('./schemas/Room');
require('dotenv').config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  // 클라이언트 주소
  cors: {
    origin: 'http://localhost:3000',
  },
});
// io 를 /utils/io.js 로 전달
require('./utils/io')(io);

httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log('server listening on port', process.env.SOCKET_PORT);
});

const connect = require('./schemas/index');
connect();

module.exports = app;
