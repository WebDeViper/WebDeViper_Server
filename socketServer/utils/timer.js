const timerController = require('../controller/ctrTimer');
const { User, Timer } = require('../schemas/viper_beta.js');

module.exports = function (io) {
  io.on('connection', async socket => {
    console.log('client is connected!', socket.id);
    socket.on('start_watch', async data => {
      // 여기서 data 안에 userNickname 및 roomNickname이 포함되어 있다고 가정
      const { userId, subject } = data;

      // 이제 userNickname 및 roomNickname 변수를 사용할 수 있음
      console.log(userId, subject);
      try {
        const has_date_subject_timer = await timerController.hasDateSubjectTimer(userId, subject);
        // console.log("has_date_subject_timer", has_date_subject_timer);

        if (has_date_subject_timer) {
          // pause->start인경우
          io.emit('myStopwatchStart-to-Other', {
            userId,
            // roomNickname,
            subject,
            time: has_date_subject_timer,
            stopwatch_running: true,
          });
        } else {
          //그냥 start인 경우
          const timer = await timerController.saveStartWatch(userId, subject);
          io.emit('myStopwatchStart-to-Other', {
            userId,
            // roomNickname,
            subject,
            // time: 0,
            stopwatch_running: true,
          });
        }
        // const timer = await timerController.saveStartWatch(
        //   userNickname,
        //   roomNickname,
        //   subject
        // );
        // io.emit("myStopwatchStart-to-Other", {
        //   userNickname,
        //   roomNickname,
        //   subject,
        //   // time: 0,
        //   stopwatch_running: true,
        // });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('pause_watch', async data => {
      const { userId, subject, time } = data;
      console.log('pauseevent!!!', userId, subject, time);
      try {
        const timer = await timerController.updateStopWatch(userId, subject, time);
        io.emit('myStopwatchPause-to-Other', {
          userId,
          // roomNickname,
          subject,
          time,
          stopwatch_running: false,
        });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('reset_watch', async data => {
      const { userId, subject } = data;
      try {
        const time = 0;
        const timer = await timerController.updateStopWatch(userId, subject, time);
        io.emit('myStopwatchPause-to-Other', {
          userId,
          // roomNickname,
          subject,
          time: 0,
          stopwatch_running: false,
        });
      } catch (err) {
        console.log(err);
      }
    });
  });
};
