const dotenv = require('dotenv');
dotenv.config();
const { SOCKET_PORT } = process.env;
const http = require('http'); // http 모듈을 사용해야 할 수도 있습니다.
const socketIo = require('socket.io');
const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const mysql = require('mysql');
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;
const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

connection.connect(err => {
  if (err) {
    console.error('DB 연결 오류:', err);
    return;
  }
  console.log('DB 연결 완료');
});

connection.query('SELECT * FROM user', (err, result) => {
  if (err) throw err;
  console.log(result);
});

// HTTP 서버 생성
const server = http.createServer((req, res) => {
  // 필요한 경우 여기에서 HTTP 요청 처리
});

app.use('/socket', indexRouter);
// 몽고디비 연결
const connect = require('./schemas/index');
connect();

// Socket.io 인스턴스 생성
const io = socketIo(server);

io.on('connection', socket => {
  console.log('사용자가 연결했습니다.');

  socket.on('disconnect', () => {
    console.log('사용자가 연결을 끊었습니다.');
  });

  // 실시간 통신을 위한 더 많은 소켓 이벤트 핸들러를 여기에 추가

  // 예: 모든 연결된 클라이언트에 메시지를 브로드캐스트
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});
app.get('/api/company', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');

  const sqlQuery = 'SELECT * FROM USER';

  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

// 서버 시작
server.listen(SOCKET_PORT || 8002, () => {
  console.log(`소켓 서버가 포트 ${SOCKET_PORT}에서 실행 중입니다.`);
});
