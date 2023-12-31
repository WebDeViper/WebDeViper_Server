const { Timer, mongoose } = require('../schemas/schema');
const { User, Group, UserGroupRelation, Sequelize } = require('../models');
const today = new Date();
today.setHours(0, 0, 0, 0);

//   try {
//     // const currentId = '654a7551267f25b768be3178';
//     const currentId = res.locals.decoded.userInfo.id;
//     if (!currentId) {
//       return res.status(400).send({ isSuccess: false, code: 400, message: '사용자 정보를 찾을 수 없습니다.' });
//     } else {
//       const userTimerInfo = await getTimerInfo(currentId, today);
//       if (!userTimerInfo) {
//         // Create a new Timer for the user with today's date
//         const newTimer = new Timer({
//           user_id: currentId,
//           daily: {
//             date: today, // Set to today's date
//             data: [],
//           },
//         });
//         await newTimer.save();
//       }
//       // Populate the 'groups' field to retrieve the actual group information
//       // Populate the 'groups' field to retrieve the actual group information
//       const populatedUser = await User.findById(currentId).populate({
//         path: 'groups',
//         populate: {
//           path: 'members',
//           model: 'User',
//         },
//       });
//       const groupsArray = populatedUser.groups.map(async group => {
//         // Extract basic group information
//         const groupInfo = {
//           groupId: group._id,
//           group_name: group.group_name,
//           members: [],
//         };
//         // Iterate through the populated 'members' field
//         for (const member of group.members) {
//           const timerInfo = await getTimerInfo(member._id, today);
//           console.log(timerInfo, 'zzzzzzzz');
//           // Extract member information
//           const memberInfo = {
//             _id: member._id,
//             nick_name: member.nick_name,
//             is_running: timerInfo ? timerInfo.is_running : 'y',
//             total_time: timerInfo ? timerInfo.total_time : 0,
//             // This is where you can extract the member's total_time
//             // Modify this part based on your schema structure
//           };
//           groupInfo.members.push(memberInfo);
//         }
//         console.log(groupInfo, '>>>>>>>');
//         return groupInfo;
//       });
//       // Wait for all promises to resolve
//       const groupData = await Promise.all(groupsArray);
//       console.log('=========', groupData, '===========', userTimerInfo);
//       res.status(200).send({ groupData, userTimerInfo });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
async function getTimerInfo(userId, date) {
  const timerInfo = await Timer.findOne({
    user_id: userId,
    'daily.date': date,
  });
  return timerInfo;
}
exports.updateStopWatch = async (data, userId) => {
  console.log('ctrTimer@@', data, userId);
  const { subject, time, is_running } = data;
  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': today, // 오늘 날짜
  });
  console.log(result);
  if (!result) {
    // Case 1: 해당 유저의 날짜에 대한 Timer 도큐먼트가 없는 경우
    const newTimer = await Timer.create({
      user_id: userId,
      is_running,
      'daily.date': today,
      'daily.data': [
        {
          title: subject,
          timer: time, // 초기값으로 설정할 타이머 값
        },
      ],
      total_time: time, // 새로운 타이머가 추가될 때 total_time에 초기값으로 설정
    });
    console.log(newTimer);
    const timerInfo = await Timer.findOne({ user_id: userId, 'daily.data.title': subject, 'daily.date': today });
    return timerInfo;
  } else {
    const existingSubjectIndex = result.daily.data.findIndex(item => item.title === subject);

    if (existingSubjectIndex === -1) {
      // Case 2: 타이머는 있지만 해당 과목이 없는 경우
      const updatedTimer = await Timer.updateOne(
        {
          user_id: userId,
          'daily.date': today,
        },
        {
          $push: {
            'daily.data': {
              title: subject,
              timer: time,
            },
          },
          $inc: { total_time: time },
        }
      );
      const timerInfo = await Timer.findOne({ user_id: userId, 'daily.data.title': subject, 'daily.date': today });
      console.log('Timer Updated:', timerInfo);
      return timerInfo;
    } else {
      //해당과목의 타이머가 있는 경우
      const oldTimerValue = result.daily.data[existingSubjectIndex].timer;

      const updatedTimer = await Timer.updateOne(
        {
          user_id: userId,
          'daily.data.title': subject,
          'daily.date': today,
        },
        {
          $set: {
            'daily.data.$.timer': time,
            is_running,
          },
          $inc: { total_time: time - oldTimerValue },
        }
      );
      console.log('Timer Updated:', updatedTimer);
      const timerInfo = await Timer.findOne({ user_id: userId, 'daily.data.title': subject, 'daily.date': today });
      return timerInfo;
    }
  }
};
exports.getUserTimer = async userId => {
  try {
    const timer = await getTimerInfo(userId, today);
    if (timer) {
      return timer;
    } else {
      const newTimer = await Timer.create({ user_id: userId, 'daily.date': today });
      return newTimer;
    }
  } catch (err) {
    console.log(err);
  }
};
