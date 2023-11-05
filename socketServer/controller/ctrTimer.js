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
  // const timer = await Timer.findOne({ user_id: userId }).populate('user_id', 'groups').exec();
  //이렇게 하면 오늘 공부 처음 시작한 경우에는 찾아올 수 없어서 undefined 뜸
  const user = await User.findById(userId);
  console.log('###########', user.groups, '#############');
  return user.groups; //유저가 속한 그룹을 가져옵니다. 배열 형태로...
};

exports.hasDateSubjectTimer = async (userId, subject) => {
  const koreaDate = getKoreaDate();

  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': koreaDate,
  });
  const userGroups = await Timer.findOne({
    user_id: userId,
    'daily.date': koreaDate,
  }).populate('user_id', 'groups');
  console.log('??????????', userGroups);

  console.log('있을까?>>>', result);
  // console.log('???????그룹에어떻게 접근하지', Timer.userId.groups);

  if (result) {
    // restart인 경우
    const { daily } = result;
    if (daily && Array.isArray(daily.data)) {
      const hasData = daily.data.find(data => {
        return data.title === subject;
      });
      if (hasData) {
        console.log(hasData.timer);
        return hasData.timer;
      }
    }
    return false;
  } else {
    // start인 경우
  }
};

const updateTimerData = async (userId, subject, time) => {
  const koreaDate = getKoreaDate();

  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': koreaDate,
  });

  if (result) {
    const subjectData = result.daily.data.find(item => item.title === subject);

    if (subjectData) {
      subjectData.timer = time;
    } else {
      result.daily.data.push({
        title: subject,
        timer: time,
      });
    }

    await result.save();
    console.log('Data has been updated:', result);
  } else {
    const newTimer = new Timer({
      user_id: userId,
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
    console.log('A new document has been created and saved!');
  }
};

exports.saveStartWatch = async (user_id, subject) => {
  updateTimerData(user_id, subject, 0);
};

exports.updateStopWatch = async (user_id, subject, time) => {
  updateTimerData(user_id, subject, time);
};
