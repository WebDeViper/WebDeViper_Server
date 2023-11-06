const { Timer, User, mongoose } = require('../schemas/schema');

const moment = require('moment-timezone');

const getKoreaDate = () => {
  const koreaTimezone = 'Asia/Seoul';
  const currentDate = moment().tz(koreaTimezone);
  currentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  return currentDate.toISOString();
};
// Now you can use getKoreaDate() to get the start of the current day in the Asia/Seoul timezone

exports.getUserGroups = async userId => {
  const timer = await Timer.findOne({ user_id: userId }).populate('user_id', 'groups').exec();
  console.log('====', timer.user_id.groups);
  //이렇게 하면 오늘 공부 처음 시작한 경우에는 찾아올 수 없어서 undefined 뜸
  // const user = await User.findById(userId);
  //console.log('###########', user.groups, '#############');
  return timer.user_id.groups; //유저가 속한 그룹을 가져옵니다. 배열 형태로...
};

exports.hasDateSubjectTimer = async (userId, subject) => {
  const koreaDate = getKoreaDate();

  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': koreaDate,
  });

  // console.log('???????그룹에어떻게 접근하지', Timer.userId.groups);

  if (result) {
    // restart인 경우
    const { daily } = result;
    if (daily && Array.isArray(daily.data)) {
      const hasData = daily.data.find(data => {
        return data.title === subject;
      });
      if (hasData) {
        console.log('============', hasData.timer);
        return hasData.timer;
      } else {
        return false;
      }
    }
  }
};

const updateTimerData = async (userId, subject, time) => {
  const koreaDate = getKoreaDate();

  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': koreaDate,
  });

  if (result) {
    // 다른 과목에 해당하는 타이머는 있으나 새로운 과목을 추가해서 타이머를 시작 한 경우
    const subjectData = result.daily.data.find(item => item.title === subject);

    if (subjectData) {
      // 해당 과목의 타이머를 업데이트하고 total_time에 시간을 더합니다
      subjectData.timer += time;
      result.total_time += time;
    } else {
      // 과목 데이터가 없으면 새 항목을 추가합니다
      result.daily.data.push({
        title: subject,
        timer: time,
      });
      // total_time을 업데이트합니다
      result.total_time += time;
    }

    await result.save();
    console.log('데이터가 업데이트되었습니다:', result);
  } else {
    //오늘 처음 스탑워치를 누른 경우
    const newTimer = new Timer({
      user_id: userId,
      total_time: time, // 주어진 시간으로 total_time을 초기화합니다
      daily: {
        date: koreaDate,
        data: [
          {
            title: subject,
            timer: time,
          },
        ],
      },
    });

    await newTimer.save();
    console.log('새 문서가 생성되고 저장되었습니다!');
  }
};
exports.getGroupMembers = async userGroupIds => {
  try {
    for (const groupId of userGroupIds) {
      // 그룹 정보 조회
      const group = await Group.findById(groupId).exec();
      if (group) {
        console.log(`그룹 정보 - ID: ${group._id}, 이름: ${group.group_name}`);

        // 그룹에 속한 사용자 조회
        const groupUsers = await User.find({ groups: groupId }).exec();
        console.log(`그룹에 속한 사용자:`);
        console.log(groupUsers);
        return groupUsers;
      }
    }
  } catch (error) {
    console.error('그룹 및 사용자 조회 실패:', error);
  }
};

exports.saveStartWatch = async (userId, subject) => {
  updateTimerData(userId, subject, 0);
};

exports.updateStopWatch = async (userId, subject, time) => {
  updateTimerData(userId, subject, time);
};
