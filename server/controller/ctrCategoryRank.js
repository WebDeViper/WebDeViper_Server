const NodeCache = require('node-cache');
const rankingCache = new NodeCache();
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
    //토큰 값에서 현재 유저 카테고리 정보 가져오기
    const userId = res.locals.decoded.userInfo.id;

    if (!userId) {
      console.log('유저 로그인 안된상태에서 카테고리 보낼 수 있을까??');
    }
    const userInfo = await User.findOne({ where: { user_id: userId } });
    const userCategory = userInfo.dataValues.category;

    if (req.query.category) {
      // 요청에서 카테고리 파라미터가 주어진 경우, 해당 카테고리의 랭킹을 조회합니다.
      const userRanking = await getCachedUserRanking(req.query.category || userCategory, yesterday);
      const groupRanking = await getCachedGroupRanking(req.query.category || userCategory, yesterday);
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
      const userRanking = await getCachedUserRanking(req.query.category, yesterday);
      const groupRanking = await getCachedGroupRanking(req.query.category, yesterday);
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
exports.getCategoryRank = async (req, res) => {
  console.log('토큰이 없지롱');

  if (req.query.category) {
    const userRanking = await getCachedUserRanking(req.query.category, yesterday);
    const groupRanking = await getCachedGroupRanking(req.query.category, yesterday);

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
    try {
      // findMostCommonCategory 함수를 호출하고 해당 결과를 기다립니다.
      const mostCommonCategory = await findMostCommonCategory();

      // getCachedUserRanking과 getCachedGroupRanking을 호출하고 해당 결과를 기다립니다.
      const userRanking = await getCachedUserRanking(mostCommonCategory, yesterday);
      const groupRanking = await getCachedGroupRanking(mostCommonCategory, yesterday);

      if (!userRanking.length && !groupRanking.length) {
        return res.status(200).send({ message: '유저 및 스터디 그룹 없음' });
      } else if (!userRanking.length) {
        return res.status(200).send({ message: '유저 없음', topGroups: groupRanking });
      } else if (!groupRanking.length) {
        return res.status(200).send({ message: '스터디 그룹 없음', topUsers: userRanking });
      } else {
        return res.status(200).send({ topUsers: userRanking, topGroups: groupRanking });
      }
    } catch (error) {
      console.error('데이터 처리 오류:', error);
      // 오류 처리 로직 추가
      res.status(500).send({ message: '서버 오류 발생' });
    }
  }
};

async function getRankingData(data, date) {
  const rankingData = await Promise.all(
    data.map(async item => {
      const userInfo = await User.findOne({ where: { user_id: item.user_id } });
      const nickname = userInfo.nick_name;
      const user_profile_image_path = userInfo.image_path;
      const total_time = await Timer.find({ user_id: item.user_id, 'daily.date': date });
      return {
        user_nickname: nickname,
        user_total_time: total_time.length > 0 ? total_time[0].total_time : 0,
        user_profile_image_path,
      };
    })
  );

  return rankingData.sort((a, b) => b.user_total_time - a.user_total_time).slice(0, 10);
}

async function getCachedGroupRanking(userCategory, date) {
  const cacheKey = `groupRanking:${userCategory}:${date.toISOString()}`;

  const cachedResult = rankingCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const userCategoryGroupsPromise = await Group.findAll({ where: { category: userCategory } });
  console.log(userCategoryGroupsPromise, '%%%%');
  const groupRankingDataPromise = Promise.all(
    userCategoryGroupsPromise.map(async group => {
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
          },
        ],
      });

      await Promise.all(
        members.map(async member => {
          const memberInfo = await User.findOne({ where: { user_id: member.user_id } });
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
        })
      );

      if (groupData.membersTime.length > 0) {
        const totalTimes = groupData.membersTime.map(member => member.total_time);
        const averageTime = totalTimes.reduce((acc, time) => acc + time, 0) / totalTimes.length;
        groupData.averageTime = averageTime;
      } else {
        groupData.averageTime = 0;
      }

      return groupData;
    })
  );

  const sortedGroupRankingData = (await groupRankingDataPromise).sort((a, b) => b.averageTime - a.averageTime);

  rankingCache.set(cacheKey, sortedGroupRankingData, 3600); // 6시간 동안 유효

  return sortedGroupRankingData.slice(0, 10);
}
async function getCachedUserRanking(userCategory, date) {
  const cacheKey = `userRanking:${userCategory}:${date.toISOString()}`;

  const cachedResult = rankingCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const sameCategoryUsersPromise = User.findAll({ where: { category: userCategory } });
  const rankingDataPromise = sameCategoryUsersPromise.then(users => getRankingData(users, date));

  const [sameCategoryUsers, rankingData] = await Promise.all([sameCategoryUsersPromise, rankingDataPromise]);
  const result = rankingData;

  rankingCache.set(cacheKey, result, 3600);

  return result;
}
async function findMostCommonCategory() {
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
}
