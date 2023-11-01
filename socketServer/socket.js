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

//  임의로 룸을 만들어주기
app.get('/', async (req, res) => {
  console.log('룸만들기!');
  Room.insertMany([
    {
      room: '공무원',
      members: [],
    },
    {
      room: '취준생',
      members: [],
    },
    {
      room: '연습생',
      members: [],
    },
  ])
    .then(() => res.send('ok'))
    .catch(error => res.send(error));
});
httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log('server listening on port', process.env.SOCKET_PORT);
});

const connect = require('./schemas/index');
connect();

module.exports = app;
