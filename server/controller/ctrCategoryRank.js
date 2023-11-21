const { User, Group, UserGroupRelation, Sequelize } = require('../models');
const { Timer, mongoose } = require('../schemas/schema');
const today = new Date();
console.log(today);

// 현재 날짜에서 1일(24시간)을 빼서 어제 날짜를 얻습니다.
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

exports.getMyCategoryRank = async (req, res) => {
  try {
    // console.log(req.query.category);
    //토큰 값에서 현재 유저 카테고리 정보 가져오기
    // const userCategory=res.locals.decoded.userCategory
    const userId = res.locals.decoded.userInfo.id;
    // const userId = '02264a3f-ddfb-47c2-b7b5-d3ffaf136e99';
    if (!userId) {
      console.log('유저 로그인 안된상태에서 카테고리 보낼 수 있을까??');
    }
    const userInfo = await User.findOne({ where: { user_id: userId } });
    // 테스트 용(나중에 주석)
    console.log(userInfo.dataValues.category);
    const userCategory = userInfo.dataValues.category;
    console.log(userCategory);

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSucecess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

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
      console.log('유저랭킹????', userRanking);
      const groupRanking = await getGroupRanking(userCategory, yesterday);
      if (!userRanking.length && !groupRanking.length) {
        return res.status(200).send({ message: '유저 및 스터디 그룹 없음' });
      } else if (!userRanking.length) {
        return res.status(200).send({ message: '유저 없음', topGroups: groupRanking });
      } else if (!groupRanking.length) {
        return res.status(200).send({ message: '스터디 그룹 없음', topUsers: userRanking });
      } else {
        return res.status(200).send({ topUsers: userRanking, topGroups: groupRanking });
      }
    }
  } catch (error) {
    console.error('데이터 처리 오류:', error);
  }
};

async function getUserRanking(userCategory, date) {
  const sameCategoryUsers = await User.findAll({ where: { category: userCategory } });
  return getRankingData(sameCategoryUsers, date);
}

async function getGroupRanking(userCategory, date) {
  const userCategoryGroups = await Group.findAll({ where: { category: userCategory } });
  console.log(userCategoryGroups);
  const groupRankingData = [];

  for (const group of userCategoryGroups) {
    const groupData = {
      group_name: group.name,
      membersTime: [],
      group_image_path: group.image_path,
    };

    const members = await User.findAll({
      include: [
        {
          model: Group,
          through: { model: UserGroupRelation, where: { group_id: group.group_id, request_status: 'a' } },
          // attributes: [], // Exclude attributes from the UserGroupRelation model
        },
      ],
    });
    console.log('members', members.length > 0 ? members : 'No members found');

    for (const member of members) {
      const memberInfo = await User.findOne({ where: { user_id: member.user_id } });
      console.log(memberInfo.user_id, '멤버아이디');
      const memberTimer = await Timer.find({
        user_id: memberInfo.user_id,
        'daily.date': date,
      });

      if (memberTimer.length > 0) {
        const totalMemberTime = memberTimer[0].total_time;
        groupData.membersTime.push({ member_id: memberInfo.user_id, total_time: totalMemberTime });
      } else {
        groupData.membersTime.push({ member_id: memberInfo.user_id, total_time: 0 });
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
    const userInfo = await User.findOne({ where: { user_id: item.user_id } });
    const nickname = userInfo.nick_name;
    const user_profile_image_path = userInfo.image_path;
    const total_time = await Timer.find({ user_id: item.user_id, 'daily.date': date });
    const userData = {
      user_nickname: nickname,
      user_total_time: total_time.length > 0 ? total_time[0].total_time : 0,
      user_profile_image_path,
    };
    rankingData.push(userData);
  }
  rankingData.sort((a, b) => b.user_total_time - a.user_total_time);
  return rankingData.slice(0, 10);
}

exports.getCategoryRank = async (req, res) => {
  console.log('토큰이 없지롱');
  //가장 많은 유저가 속한 카테고리를 찾는다.

  const findMostCommonCategory = async () => {
    try {
      // 카테고리별로 사용자 수를 카운트하고 내림차순으로 정렬
      const result = await User.findAll({
        attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('category')), 'userCount']],
        group: ['category'],
        order: [[Sequelize.literal('userCount'), 'DESC']],
        limit: 1, // 결과 중에서 가장 많은 하나의 카테고리만 가져옴
      });

      if (result && result.length > 0) {
        const mostCommonCategory = result[0].category;
        return mostCommonCategory;
      } else {
        console.log('No users or categories found.');
        return null;
      }
    } catch (error) {
      console.error('Error finding most common category:', error);
      return null;
    }
  };

  // 호출
  const mostCommonCategory = await findMostCommonCategory();
  console.log(mostCommonCategory);
  const userRanking = await getUserRanking(mostCommonCategory, yesterday);
  console.log('유저랭킹????', userRanking);
  const groupRanking = await getGroupRanking(mostCommonCategory, yesterday);
  if (!userRanking.length && !groupRanking.length) {
    return res.status(200).send({ message: '유저 및 스터디 그룹 없음' });
  } else if (!userRanking.length) {
    return res.status(200).send({ message: '유저 없음', topGroups: groupRanking });
  } else if (!groupRanking.length) {
    return res.status(200).send({ message: '스터디 그룹 없음', topUsers: userRanking });
  } else {
    return res.status(200).send({ topUsers: userRanking, topGroups: groupRanking });
  }
};
