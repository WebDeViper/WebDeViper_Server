const { User, Group, Timer, mongoose } = require('../schemas/schema');
const today = new Date();
today.setHours(0, 0, 0, 0);
exports.getTimerByUser = async (req, res) => {
  try {
    // const currentId = '654a7551267f25b768be3178';
    const currentId = res.locals.decoded.userInfo.id;

    if (!currentId) {
      return res.status(400).send({ isSuccess: false, code: 400, message: '사용자 정보를 찾을 수 없습니다.' });
    } else {
      const userTimerInfo = await getTimerInfo(currentId, today);
      if (!userTimerInfo) {
        // Create a new Timer for the user with today's date
        const newTimer = new Timer({
          user_id: currentId,
          daily: {
            date: today, // Set to today's date
            data: [],
          },
        });

        await newTimer.save();
      }

      // Populate the 'groups' field to retrieve the actual group information
      // Populate the 'groups' field to retrieve the actual group information
      const populatedUser = await User.findById(currentId).populate({
        path: 'groups',
        populate: {
          path: 'members',
          model: 'User',
        },
      });
      const groupsArray = populatedUser.groups.map(async group => {
        // Extract basic group information
        const groupInfo = {
          groupId: group._id,
          group_name: group.group_name,
          members: [],
        };

        // Iterate through the populated 'members' field
        for (const member of group.members) {
          const timerInfo = await getTimerInfo(member._id, today);

          // Extract member information
          const memberInfo = {
            _id: member._id,
            nick_name: member.nick_name,
            is_running: timerInfo ? timerInfo.is_running : false,
            total_time: timerInfo ? timerInfo.total_time : 0,
            // This is where you can extract the member's total_time
            // Modify this part based on your schema structure
          };

          groupInfo.members.push(memberInfo);
        }
        console.log(groupInfo, '>>>>>>>');
        return groupInfo;
      });

      // Wait for all promises to resolve
      const groupData = await Promise.all(groupsArray);
      console.log('=========', groupData, '===========', userTimerInfo);
      res.status(200).send({ groupData, userTimerInfo });
    }
  } catch (err) {
    console.log(err);
  }
};
async function getTimerInfo(userId, date) {
  const timerInfo = await Timer.findOne({
    user_id: userId,
    'daily.date': date,
  });

  return timerInfo;
}
