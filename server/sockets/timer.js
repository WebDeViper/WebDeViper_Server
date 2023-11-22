const timerController = require('../controller/ctrTimer');
const { Timer, mongoose } = require('../schemas/schema');

module.exports = function (io) {
  const timerSpace = io.of('/stopwatch'); //timer 네임스페이스 지정
  timerSpace.on('connection', async socket => {
    console.log('소켓 아이디는?', socket.id);
    console.log('userId::', socket.handshake.auth.userId);
    console.log('client is connected in stopwatch!', socket.id);
    const userId = socket.handshake.auth.userId;
    socket.on('start', async data => {
      console.log('start event!!', data);
      await timerController.updateStopWatch(data, userId);
    });
    socket.on('pause', async data => {
      console.log('pause_event!!', data);
      await timerController.updateStopWatch(data, userId);
    });
    socket.on('joinGroup', async groupId => {
      // "joinGroup" 이벤트를 받으면 이 함수가 실행됩니다.
      console.log(`클라이언트가 그룹 ${groupId}에 가입을 시도합니다.`);
      // joinGroup(groupId, userId);

      socket.join(groupId);

      const groupMemberTimerInfo = await timerController.getGroupMemberTimerInfo(userGroupIds);
      socket.emit('groupJoined', groupMemberTimerInfo);
      // 이제 클라이언트가 그룹에 가입할 수 있도록 필요한 작업을 수행하세요.
    });

    socket.on('start_watch', async data => {
      const groupMembers = await timerController.getGroupMembers(userGroupIds);
      // 여기서 data 안에 userNickname 및 roomNickname이 포함되어 있다고 가정
      const { userId, subject } = data;

      console.log(userId, subject); // 654b82f0fc2977b9849c073e 영어
      try {
        const has_date_subject_timer = await timerController.hasDateSubjectTimer(userId, subject);
        console.log('has_date_subject_timer', has_date_subject_timer);

        if (has_date_subject_timer) {
          // pause->start인경우
          // userGroupIds.forEach(groupId => {
          //   const groupIdString = groupId.toString();
          //   timerSpace.to(groupIdString).emit('myStopwatchStart-to-Other', {
          //     userId,
          //     subject,
          //     time: has_date_subject_timer,
          //     stopwatch_running: true,
          //   });
          // });
          timerSpace.emit('myStopwatchStart-to-Other', {
            _id: userId,
            // roomNickname,
            subject,
            time: has_date_subject_timer,
            is_running: true,
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
          // userGroupIds.forEach(groupId => {
          //   const groupIdString = groupId.toString();
          //   console.log('groupIdString', groupIdString);
          //   timerSpace.to(groupIdString).emit('myStopwatchStart-to-Other', {
          //     userId,
          //     subject,
          //     stopwatch_running: true,
          //   });
          // });
          timerSpace.emit('myStopwatchStart-to-Other', {
            _id: userId,
            // roomNickname,
            subject,

            time: 0,

            is_running: true,
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
        const total_time = await timerController.getTotalTime(userId);
        console.log(total_time, 'total_timetotal_time');
        // userGroupIds.forEach(groupId => {
        //   const groupIdString = groupId.toString();
        //   timerSpace.to(groupIdString).emit('myStopwatchPause-to-Other', {
        //     userId,
        //     subject,
        //     time,
        //     stopwatch_running: false,
        //   });
        // });
        timerSpace.emit('myStopwatchPause-to-Other', {
          _id: userId,
          subject,
          time: total_time + time,
          is_running: false,
        });
        // timerSpace.emit('myStopwatchPause-to-Other', {
        //   userId,
        //   subject,
        //   time: total_time,
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
        // userGroupIds.forEach(groupId => {
        //   const groupIdString = groupId.toString();
        //   timerSpace.to(groupIdString).emit('myStopwatchPause-to-Other', {
        //     userId,
        //     subject,
        //     time: 0,
        //     stopwatch_running: false,
        //   });
        // });
        timerSpace.emit('myStopwatchPause-to-Other', {
          _id: userId,
          // roomNickname,
          subject,
          time: 0,
          is_running: false,
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
