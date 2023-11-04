const timerController = require('../controller/ctrTimer');
const { User, Timer } = require('../schemas/viper_beta.js');

module.exports = function (io) {
  const timerSpace = io.of('/stopwatch'); //timer 네임스페이스 지정
  timerSpace.on('connection', async socket => {
    console.log('client is connected in stopwatch!', socket.id);
    const userId = socket.handshake.query.userId;
    const userGroupIds = await timerController.getUserGroups(userId);
    timerSpace.emit('welcome', { userGroupIds });
    // console.log('과연 유저의 그룹을 가져왔을까!!!', userGroups);

    socket.on('start_watch', async data => {
      // 여기서 data 안에 userNickname 및 roomNickname이 포함되어 있다고 가정
      const { subject } = data;

      console.log(subject);
      try {
        const has_date_subject_timer = await timerController.hasDateSubjectTimer(userId, subject);
        // console.log("has_date_subject_timer", has_date_subject_timer);

        if (has_date_subject_timer) {
          // pause->start인경우
          userGroupIds.forEach(groupId => {
            timerSpace.to(groupId).emit('myStopwatchStart-to-Other', {
              userId,
              subject,
              time: has_date_subject_timer,
              stopwatch_running: true,
            });
          });
          // timerSpace.emit('myStopwatchStart-to-Other', {
          //   userId,
          //   // roomNickname,
          //   subject,
          //   time: has_date_subject_timer,
          //   stopwatch_running: true,
          // });
        } else {
          //그냥 start인 경우
          const timer = await timerController.saveStartWatch(userId, subject);
          userGroupIds.forEach(groupId => {
            timerSpace.to(groupId).emit('myStopwatchStart-to-Other', {
              userId,
              subject,
              stopwatch_running: true,
            });
          });
          // timerSpace.emit('myStopwatchStart-to-Other', {
          //   userId,
          //   // roomNickname,
          //   subject,
          //   // time: 0,
          //   stopwatch_running: true,
          // });
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
        await timerController.updateStopWatch(userId, subject, time);
        userGroupIds.forEach(groupId => {
          timerSpace.to(groupId).emit('myStopwatchPause-to-Other', {
            userId,
            subject,
            time,
            stopwatch_running: false,
          });
        });
        // timerSpace.emit('myStopwatchPause-to-Other', {
        //   userId,
        //   subject,
        //   time,
        //   stopwatch_running: false,
        // });
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('reset_watch', async data => {
      const { userId, subject } = data;
      try {
        const time = 0;
        await timerController.updateStopWatch(userId, subject, time);
        userGroupIds.forEach(groupId => {
          timerSpace.to(groupId).emit('myStopwatchPause-to-Other', {
            userId,
            subject,
            time: 0,
            stopwatch_running: false,
          });
        });
        userGroupIds.forEach(groupId => {
          timerSpace.to(groupId).emit('myStopwatchPause-to-Other', {
            userId,
            subject,
            time: 0,
            stopwatch_running: false,
          });
        });
        // timerSpace.emit('myStopwatchPause-to-Other', {
        //   userId,
        //   // roomNickname,
        //   subject,
        //   time: 0,
        //   stopwatch_running: false,
        // });
      } catch (err) {
        console.log(err);
      }
    });
  });
};
