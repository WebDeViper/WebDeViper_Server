const { Timer, User, Group, mongoose } = require('../schemas/schema');

const today = new Date();
today.setHours(0, 0, 0, 0);

// Now you can use getKoreaDate() to get the start of the current day in the Asia/Seoul timezone

exports.getUserGroups = async userId => {
  console.log(userId);
  try {
    // async/await를 사용하여 userId로 사용자를 찾습니다.
    let user = await User.findOne({ _id: userId });
    console.log(user, '^^^^^^^^^^^^^^^^^');
    // {
    //   _id: new ObjectId("654c671d1d4de328dd98277b"),
    //   user_category_name: '초등학생',
    //   nick_name: '카카오김세은',
    //   user_profile_image_path: '/api/static/profileImg/defaultProfile.jpeg',
    //   status_message: null,
    //   is_service_admin: false,
    //   email: 'cocobell3@naver.com',
    //   provider: 'kakao',
    //   sns_id: '3138635473',
    //   groups: [],
    //   rooms: [],
    //   pending_groups: [],
    //   __v: 0
    // }
    if (!user) {
      // 사용자를 찾을 수 없으면 에러 메시지를 설정하고 던집니다.
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 사용자가 그룹을 가지고 있지 않거나 "내 개인 그룹"이 없는 경우에만 생성
    const personalGroup = await Group.findOne({ group_leader: user._id, group_name: '내 개인 그룹', is_private: true });
    console.log(personalGroup);
    if (!personalGroup) {
      const defaultGroup = new Group({
        group_leader: user._id, // 사용자를 그룹 리더로 지정
        group_name: '내 개인 그룹', // 개인 그룹의 이름을 설정
        is_private: true,
        members: userId,
        // 필요한 다른 그룹 속성을 설정합니다.
      });

      await defaultGroup.save();
      // console.log(user.groups);
      // 사용자의 그룹 목록에 개인 그룹을 배열의 맨 앞에 추가합니다.
      user.groups.unshift(defaultGroup);
      user.markModified('groups');
      await user.save();

      console.log('defaultGroup??', user.groups[0]); // new ObjectId("654c600623f167936e437352")
    }

    // 사용자의 그룹 목록을 반환합니다.
    // console.log(user.groups, 'adfafdafasf');
    return user.groups;
  } catch (error) {
    // 잠재적인 오류(예: 데이터베이스 연결 문제)를 처리합니다.
    console.error('사용자 그룹을 가져오거나 생성하는 중 오류 발생:', error);
    throw error; // 오류를 다시 던지거나 필요에 따라 처리할 수 있습니다.
  }
};

exports.hasDateSubjectTimer = async (userId, subject) => {
  // const koreaDate = getKoreaDate();

  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': today,
  });

  // console.log('???????그룹에어떻게 접근하지', Timer.userId.groups);

  if (result) {
    console.log(result, 'resultresultresultresultresultresult');
    // restart인 경우
    const { daily } = result;
    // result.is_running = true;
    if (daily && Array.isArray(daily.data)) {
      const hasData = daily.data.find(data => {
        return data.title === subject;
      });
      if (hasData) {
        console.log('============', hasData);
        const userTimer = await Timer.find({ user_id: userId, 'daily.date': today });
        return userTimer[0].total_time;
      } else {
        return false;
      }
    }
  }
};

const updateTimerData = async (userId, subject, time) => {
  // const koreaDate = getKoreaDate();

  const result = await Timer.findOne({
    user_id: userId,
    'daily.date': today,
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
    result.is_running = !result.is_running;
    await result.save();
    console.log('데이터가 업데이트되었습니다:', result);
  } else {
    //오늘 처음 스탑워치를 누른 경우
    const newTimer = new Timer({
      user_id: userId,
      total_time: time, // 주어진 시간으로 total_time을 초기화합니다
      is_running: true,
      daily: {
        date: today,
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
exports.getTotalTime = async userId => {
  try {
    const userTimer = await Timer.find({ user_id: userId, 'daily.date': today });
    console.log('&&&&&&&&', userTimer[0].total_time, '&&&&&&&&&&&&&&&&');
    return userTimer[0].total_time;
  } catch (err) {
    console.log(err);
  }
};
exports.saveStartWatch = async (userId, subject) => {
  updateTimerData(userId, subject, 0);
};

exports.updateStopWatch = async (userId, subject, time) => {
  updateTimerData(userId, subject, time);
};
exports.getUserNickName = async userId => {
  const user = await User.findById({ _id: userId });
  // console.log('asdfadsfadf', user);
  return user.nick_name;
};
exports.getGroupMemberTimerInfo = async function (userGroupIds) {
  const groupData = []; // 그룹 정보를 담을 배열

  for (const userGroupId of userGroupIds) {
    const group = await Group.findById(userGroupId);
    const groupInfo = {
      groupId: group._id,
      group_name: group.group_name,
      members: [],
    };
    for (const member of group.members) {
      const timerInfo = await getTimerInfo(member._id, today);
      const mem = await User.findById(member._id);
      const memberInfo = {
        _id: member._id,
        nick_name: mem.nick_name,
        is_running: timerInfo ? timerInfo.is_running : false,
        total_time: timerInfo ? timerInfo.total_time : 0,
      };
      groupInfo.members.push(memberInfo);
    }
    groupData.push(groupInfo);
  }
  console.log(groupData, '소켓접속시 만든 내가 속한 그룹의 멤버들의 타이머 데이터');
  return groupData;
};
async function getTimerInfo(userId, date) {
  const timerInfo = await Timer.findOne({
    user_id: userId,
    'daily.date': date,
  });
  return timerInfo;
}
