const { User, Group, Timer, mongoose } = require('../schemas/schema');
const today = new Date();

// 현재 날짜에서 1일(24시간)을 빼서 어제 날짜를 얻습니다.
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

exports.getMyCategoryRank = async (req, res) => {
  try {
    // console.log(req.query.category);
    //토큰 값에서 현재 유저 정보 가져오기
    // const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6549bb7f07eae932762e5e9f';
    // const userInfo = await User.findById(currentUserId);
    const userInfo = res.locals.decoded.userInfo;
    const userCategory = userInfo.category; // 사용자의 카테고리

    if (!userInfo) {
      return res.status(400).send({
        isSucecess: false,
        code: 400,
        error: '사용자 정보를 찾을 수 없습니다.',
      });
    }

    if (req.query.category) {
      // 요청에서 카테고리 파라미터가 주어진 경우, 해당 카테고리의 랭킹을 조회합니다.
      const userRanking = await getUserRanking(req.query.category, yesterday);
      const groupRanking = await getGroupRanking(req.query.category, yesterday);
      if (!userRanking.length && !groupRanking.length) {
        return res.status(200).send({ message: '유저 및 스터디 그룹 없음' });
      } else if (!userRanking.length) {
        return res.status(200).send({ message: '유저 없음', topGroups: groupRanking });
      } else if (!groupRanking.length) {
        return res.status(200).send({ message: '스터디 그룹 없음', topUsers: userRanking });
      } else {
        return res.status(200).send({ topUsers: userRanking, topGroups: groupRanking });
      }
    } else {
      // 카테고리 파라미터가 주어지지 않은 경우, 로그인한 유저와 같은 카테고리의 랭킹을 조회합니다.
      const userRanking = await getUserRanking(userCategory, yesterday);
      const groupRanking = await getGroupRanking(userCategory, yesterday);

      return res.status(200).send({ topUsers: userRanking, topGroups: groupRanking });
    }
  } catch (error) {
    console.error('데이터 처리 오류:', error);
  }
};

async function getUserRanking(userCategory, date) {
  const sameCategoryUsers = await User.find({ user_category_name: userCategory });
  return getRankingData(sameCategoryUsers, date);
}

async function getGroupRanking(userCategory, date) {
  const userCategoryGroups = await Group.find({ group_category: userCategory });
  const groupRankingData = [];

  for (const group of userCategoryGroups) {
    const groupData = {
      group_name: group.group_name,
      membersTime: [],
      group_image_path: group.group_image_path,
    };

    const members = group.members;

    for (const memberId of members) {
      const memberTimer = await Timer.find({
        user_id: memberId,
        'daily.date': date,
      });

      if (memberTimer.length > 0) {
        const totalMemberTime = memberTimer[0].total_time;
        groupData.membersTime.push({ member_id: memberId, total_time: totalMemberTime });
      } else {
        groupData.membersTime.push({ member_id: memberId, total_time: 0 });
      }
    }

    // 평균 total_time 계산
    if (groupData.membersTime.length > 0) {
      const totalTimes = groupData.membersTime.map(member => member.total_time);
      const averageTime = totalTimes.reduce((acc, time) => acc + time, 0) / totalTimes.length;
      groupData.averageTime = averageTime;
    } else {
      groupData.averageTime = 0;
    }

    groupRankingData.push(groupData);
  }

  // 그룹을 평균 total_time 기준으로 내림차순으로 정렬
  groupRankingData.sort((a, b) => b.averageTime - a.averageTime);

  return groupRankingData.slice(0, 10);
}

async function getRankingData(data, date) {
  const rankingData = [];
  for (const item of data) {
    const total_time = await Timer.find({ user_id: item._id, 'daily.date': date });
    const userData = {
      user_nickname: item.nick_name,
      user_total_time: total_time.length > 0 ? total_time[0].total_time : 0,
      user_profile_image_path: item.user_profile_image_path,
    };
    rankingData.push(userData);
  }
  rankingData.sort((a, b) => b.user_total_time - a.user_total_time);
  return rankingData.slice(0, 10);
}
