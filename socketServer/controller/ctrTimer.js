const { Timer } = require('../schemas');
exports.getTimer = async (req, res) => {
  io.on('connection', socket => {
    console.log('클라이언트가 소켓에 연결되었습니다.');

    // 이곳에서 클라이언트와 소켓 통신을 구현합니다.

    socket.on('disconnect', () => {
      console.log('클라이언트가 소켓 연결을 해제했습니다.');
    });
  });
};
