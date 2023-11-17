// const { User, Group, Timer, mongoose } = require('../schemas/schema');
const { User, Group, UserGroupRelation } = require('../models');
//모든 그룹 조회

exports.getGroups = async (req, res) => {
  try {
    const allGroup = await Group.findAll(); // 모든 그룹을 찾기
    // 그룹을 찾았는지 확인합니다.
    if (allGroup && allGroup.length > 0) {
      // 그룹을 찾았다면, 그룹을 JSON으로 포함하여 200 (OK) 상태 코드로 응답합니다.
      return res.status(200).send({ isSuccess: true, data: allGroup });
    } else {
      // 그룹을 찾지 못했다면
      return res.status(200).send({ isSuccess: true, data: false, message: '그룹이 존재하지 않습니다.' });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).send({ isSuccess: false, message: '내부 서버 오류' });
  }
};
// 그룹 아이디를 받아 그룹 정보 조회/응답
// api/group/:groupId
exports.getGroupInfo = async (req, res) => {
  try {
    const targetGroup = req.params.groupId;
    const GroupInfo = await Group.findOne({
      where: { group_id: targetGroup },
    });
    console.log('조회한 그룹 정보 >>', GroupInfo);
    res.send({
      isSuccess: true,
      message: '그룹 정보 조회 성공',
      GroupInfo,
    });
  } catch (err) {
    res.status(500).send({
      isSuccess: false,
      message: '그룹 정보 조회중 서버에러 발생',
    });
  }
};

// 카테고리에 따른 그룹 목록을 반환하는 함수
exports.getCategoryGroups = async (req, res) => {
  try {
    // 토큰에서 현재 유저 정보 가져오기
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;
    // const userCategory = userInfo.category;

    const userId = 'b626940c-3386-49f6-8990-a3f3184c1dc6';

    // 사용자의 카테고리를 조회
    const user = await User.findOne({
      where: { user_id: userId },
    });
    console.log('유저의 카테고리는 -> ', user.category);
    if (user) {
      const groups = await Group.findAll({ where: { category: `${user.category}` } });
      console.log('groups는', groups);
      if (groups.length > 0) {
        res.status(200).send({
          isSuccess: true,
          code: 200,
          study_groups: groups,
        });
      } else {
        res.status(200).send({
          isSuccess: false,
          code: 204,
          error: '해당하는 카테고리의 그룹이 없습니다.',
        });
      }
    }
  } catch (err) {
    // 에러가 발생한 경우 서버 오류 메시지와 HTTP 상태 코드 500 반환
    console.error(err);
    res.status(500).send({ isSuccess: false, code: 500, error: err });
  }
};

// 사용자별 그룹 목록을 반환하는 함수
exports.getCategoryGroupsByUser = async (req, res) => {
  try {
    // 토큰에서 현재 유저 정보 가져오기
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;
    const userId = 'b626940c-3386-49f6-8990-a3f3184c1dc6';

    // 사용자의 그룹 ID 목록 조회
    const user = await User.findByPk(userId);
    const userGroups = await user.getGroups();
    console.log(userGroups, 'user의 그룹!!');

    if (userGroups) {
      // 그룹 ID 목록을 사용하여 그룹 정보 조회
      // groups = await Group.findAll({ where:{} });

      res.status(200).send({ isSuccess: true, code: 200, study_groups: userGroups });
    } else {
      console.log('해당 유저가 속한 그룹이 없습니다.');
      // 사용자를 찾지 못한 경우에 대한 처리
      res.status(200).send({
        isSuccess: false,
        code: 204,
        message: '해당 유저가 속한 그룹이 없습니다.',
      });
    }
  } catch (err) {
    console.error(err);
    // 에러가 발생한 경우 서버 오류 메시지와 HTTP 상태 코드 500 반환
    res.status(500).send({ isSuccess: false, code: 500, error: '서버에서 오류가 발생했습니다.' });
  }
};

//그룹을 요청하는 함수
exports.joinGroupRequest = async (req, res) => {
  try {
    // 토큰에서 현재 유저 정보 가져오기
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;

    const userId = '1e363d6d-0e7e-4cd0-b088-1a66f39b99e0';

    const { groupId } = req.params; // 가입하려는 group의 object Id

    // 그룹 업데이트
    await UserGroupRelation.create({
      user_id: userId,
      group_id: groupId,
    });

    return res.status(200).send({
      isSuccess: true,
      isFull: false,
      message: '그룹 가입 요청이 성공적으로 처리되었습니다.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      isSuccess: false,
      error: '서버 오류가 발생했습니다.',
    });
  }
};
//그룹요청 수락함수
exports.acceptGroupMembershipRequest = async (req, res) => {
  // 토큰에서 현재 유저 정보 가져오기
  // const userInfo = res.locals.decoded.userInfo;

  // if (!userInfo) {
  //   return res.status(400).send({
  //     isSuccess: false,
  //     code: 400,
  //     error: '사용자 정보를 찾을 수 없습니다.',
  //   });
  // }

  // const userId = userInfo.id;
  const { groupId, requestId } = req.params;

  try {
    const request = await UserGroupRelation.findOne({ where: { user_id: requestId, group_id: groupId } });
    const rowCount = await UserGroupRelation.count({ where: { group_id: groupId, request_status: 'a' } });
    console.log(rowCount);

    if (!request) {
      return res.status(404).send({
        isSuccess: false,
        message: '해당 요청을 찾을 수 없습니다.',
      });
    }

    const groupInfo = await Group.findOne({ where: { group_id: groupId } });
    const memberMax = groupInfo ? groupInfo.member_max : null;
    console.log('memberMax는', memberMax);
    console.log('requst.lenth는', request);
    if (rowCount < memberMax) {
      await request.update({ request_status: 'a' });

      return res.status(200).send({
        isSuccess: true,
        message: '그룹 멤버십 요청을 성공적으로 수락했습니다.',
      });
    } else {
      return res.status(200).send({
        isSuccess: false,
        message: '이미 그룹 최대인원입니다.',
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).send({
      isSuccess: false,
      error: '서버 오류가 발생했습니다.',
    });
  }
};

// 그룹 요청 거절 기능 함수
exports.rejectGroupMembershipRequest = async (req, res) => {
  // 토큰에서 현재 유저 정보 가져오기
  // const userInfo = res.locals.decoded.userInfo;

  // if (!userInfo) {
  //   return res.status(400).send({
  //     isSuccess: false,
  //     code: 400,
  //     error: '사용자 정보를 찾을 수 없습니다.',
  //   });
  // }

  // const userId = userInfo.id;
  const { groupId, requestId } = req.params;

  console.log('요청한 유저의 id는 ', requestId);

  try {
    const request = await UserGroupRelation.findOne({ where: { user_id: requestId, group_id: groupId } });
    await request.update({ request_status: 'r' });
    console.log(request);

    return res.status(200).send({
      isSuccess: true,
      message: '그룹 멤버십 요청을 성공적으로 거절했습니다.',
    });
  } catch (err) {
    console.error(err);

    return res.status(500).send({
      isSuccess: false,
      error: '서버 오류가 발생했습니다.',
    });
  }
};
// 새 그룹 생성하는 함수
exports.postGroupInformation = async (req, res) => {
  try {
    //그룹을 생성하는 유저의 아이디 -> 그룹장
    // 토큰에서 현재 유저 정보 가져오기
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;
    const userId = '1e363d6d-0e7e-4cd0-b088-1a66f39b99e0';

    // 클라이언트에서 요청으로 받은 데이터 추출
    const { name, description, category, dailyGoalTime, maximumNumberMember } = req.body;

    let imagePath;

    // 파일 업로드 확인
    if (req.file) {
      const { filename } = req.file;

      imagePath = `/api/static/groupImg/${filename}`;
    }

    const newGroup = await Group.create({
      name, // 그룹이름
      category, // 그룹카테고리
      leader_id: userId,
      member_max: maximumNumberMember, // 최대 회원 수
      goal_time: dailyGoalTime, // 일일 목표 시간
      description, // 그룹 설명
      created_at: Date.now(),
      updated_at: Date.now(),
    });
    await newGroup.addUser(userId, { through: { request_status: 'a' } });

    // HTTP 상태 코드 201 (Created)와 함께 새 그룹 정보를 클라이언트에 반환
    res.status(201).send({
      isSuccess: true,
      code: 201,
      message: '스터디 그룹이 성공적으로 생성되었습니다.',
      data: newGroup,
    });
  } catch (err) {
    // 오류 발생 시 HTTP 상태 코드 500 (Internal Server Error)와 함께 오류 정보를 클라이언트에 반환
    res.status(500).send({ isSuccess: false, code: 500, err });
  }
};

//그룹 수정
exports.patchGroupInformation = async (req, res) => {
  try {
    // 토큰에서 현재 유저 정보 가져오기
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;
    const userId = '1e363d6d-0e7e-4cd0-b088-1a66f39b99e0';

    // 요청 파라미터에서 그룹 ID를 가져옴
    const { groupId } = req.params;

    // 요청 본문에서 그룹 정보 업데이트를 위한 필드들을 가져옴
    const {
      name, // 그룹 이름
      description, // 그룹 설명
      category, // 그룹의 카테고리 이름 (User FK 값)
      imagePath, // 그룹 프로필 이미지 경로
      dailyGoalTime, // 일일 목표 시간
      maximumNumberMember, // 최대 회원 수
    } = req.body;

    // 그룹 정보 업데이트 수행
    const updatedFields = {
      name,
      description,
      category,
      // img_path: imagePath,
      goal_time: dailyGoalTime,
      member_max: maximumNumberMember,
    };
    //그룹 업데이트
    // 그룹 업데이트
    const updatedGroup = await Group.findByPk(groupId);

    if (updatedGroup) {
      // 그룹 정보 업데이트
      await updatedGroup.update(updatedFields);

      // 업데이트가 성공했을 경우
      console.log('그룹이 업데이트되었습니다.');
      console.log(updatedGroup);
      res.status(200).send({ isSuccess: true, code: 200, data: updatedGroup });
    } else {
      console.log('그룹을 찾을 수 없습니다.');
      // 업데이트에 실패했을 경우 (상태코드 400과 메시지 반환)
      res.status(400).send({ isSuccess: false, code: 400, error: '업데이트에 실패했습니다.' });
    }
  } catch (err) {
    // 서버 오류가 발생한 경우 (상태코드 500과 에러 메시지 반환)
    res.status(500).send({ isSuccess: false, code: 500, error: err });
  }
};
//유저 개인이 그룹에서 나올때 (그룹 탈퇴)
exports.deleteGroup = async (req, res) => {
  try {
    // 토큰에서 현재 유저 정보 가져오기
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;
    // 요청 파라미터에서 그룹 ID를 가져옴
    const userId = '1e363d6d-0e7e-4cd0-b088-1a66f39b99e0';
    const { groupId } = req.params;

    // 그룹 삭제 수행
    const deletedGroup = await UserGroupRelation.findOne({
      where: { user_id: userId, group_id: groupId, request_status: 'a' },
    });

    if (deletedGroup) {
      // 그룹 삭제
      await deletedGroup.destroy();
      res.status(200).send({ isSuccess: true, code: 204, msg: '해당 스터디 그룹에서 탈퇴했습니다.' });
    } else {
      // 그룹을 찾지 못한 경우 또는 삭제 실패한 경우
      console.log('그룹을 찾을 수 없음:', deletedGroup);
      res.status(400).send({ isSuccess: false, code: 400, error: '그룹 탈퇴에 실패했습니다.' });
    }
  } catch (err) {
    console.error(err);
    // 서버 오류가 발생한 경우 (상태코드 500과 에러 메시지 반환)
    res.status(500).send({ isSuccess: false, code: 500, error: '서버 오류가 발생했습니다.' });
  }
};
//그룹장이 그룹 삭제
exports.removeAllMembersFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    // 그룹 삭제
    const deletedGroup = await Group.findByPk(groupId);

    if (!deletedGroup) {
      return res.status(404).send({ isSuccess: false, error: '그룹을 찾을 수 없습니다.' });
    }

    // 그룹과 연결된 모든 행 삭제 (UserGroupRelation에 설정된 onDelete: 'CASCADE'가 작동)
    await deletedGroup.destroy();

    res.status(200).send({ isSuccess: true, message: '그룹에서 모든 멤버를 삭제했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ isSuccess: false, error: '서버 오류가 발생했습니다.' });
  }
};
//모든 그룹 조회
exports.getAllRooms = async (req, res) => {
  try {
    const roomList = await Group.findAll();
    console.log('겟룸실행', roomList);
    return res.status(200).send({ isSuccess: true, data: roomList });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ isSuccess: false, error: '서버 오류가 발생했습니다.' });
  }
};

exports.getPendingGroups = async (req, res) => {
  try {
    // 현재 사용자 정보를 추출
    // const userInfo = res.locals.decoded.userInfo;
    // const userId = userInfo.id;

    // 사용자 정보를 조회
    const userId = '1e363d6d-0e7e-4cd0-b088-1a66f39b99e0';

    // 사용자의 "pending_groups" 배열을 가져옴
    const pendingGroups = await UserGroupRelation.findAll({
      where: { user_id: userId, request_status: 'w' },
    });

    // 그룹 정보를 담을 배열 초기화
    const groupInfoArray = [];

    // "pendingGroups" 배열 내의 그룹에 대한 그룹 정보를 가져옴
    for (const item of pendingGroups) {
      const group = await Group.findByPk(item.group_id);

      // 그룹이 존재하는 경우에만 정보를 추가
      if (group) {
        groupInfoArray.push(group);
      }
    }

    // 그룹 정보를 로깅하고 클라이언트에 응답을 보냄
    console.log(groupInfoArray);
    res.status(200).send({ pendingGroups: groupInfoArray });
  } catch (err) {
    // 에러 발생 시 에러 메시지를 로깅하고 클라이언트에 에러 상태 코드로 응답을 보냄
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.cancelJoinRequest = async (req, res) => {
  try {
    // const userInfo = res.locals.decoded.userInfo;

    // if (!userInfo) {
    //   return res.status(400).send({
    //     isSuccess: false,
    //     code: 400,
    //     error: '사용자 정보를 찾을 수 없습니다.',
    //   });
    // }

    // const userId = userInfo.id;
    const userId = '1e363d6d-0e7e-4cd0-b088-1a66f39b99e0';
    const { groupId } = req.params;

    const canceledRequest = await UserGroupRelation.findOne({ where: { user_id: userId, group_id: groupId } });

    if (canceledRequest) {
      await canceledRequest.destroy();

      return res.status(200).send({
        isSuccess: true,
        code: 200,
        message: '그룹 요청이 취소되었습니다.',
      });
    } else {
      return res.status(404).send({
        isSuccess: false,
        code: 404,
        error: '그룹 요청을 찾을 수 없습니다.',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      isSuccess: false,
      error: '서버 오류가 발생했습니다.',
    });
  }
};
