const { User, Group } = require('../schemas/schema');
const mongoose = require('mongoose');

// 카테고리에 따른 그룹 목록을 반환하는 함수
exports.getCategoryGroups = async (req, res) => {
  try {
    // 태균
    // 토큰에서 현재유저 user_id 가져오기
    // const userId = res.locals.decoded.userInfo.id;
    const userId = '654389417313b02c2dd34db6';

    // 사용자의 카테고리를 조회
    const user = await User.findById(userId);
    if (user) {
      const userCategory = user.user_category_name;
      //   console.log('사용자의 카테고리:', user.user_category_name); //공무원
      const groups = await Group.find({ group_category: userCategory });
      if (groups.length > 0) {
        res.status(200).send({
          isSuccess: true,
          code: 200,
          study_groups: groups,
        });
      }
      console.log(groups);
    } else {
      res.status(204).send({
        isSuccess: false,
        code: 204,
        error: '해당하는 카테고리의 그룹이 없습니다.',
      });
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
    // 토큰에서 현재유저 user_id 가져오기
    // const userId = res.locals.decoded.userInfo.id;
    const userId = '654389417313b02c2dd34db6';
    // 사용자의 그룹 ID 목록 조회
    // const userGroupIds = await .find({ user_id: userId }).select('group_id');
    // 사용자의 `groups` 필드를 조회
    const userGroup = await User.findById(userId).select('groups');
    if (userGroup) {
      console.log('사용자의 그룹 ID 목록:', userGroup.groups);
      // 그룹 ID 목록을 사용하여 그룹 정보 조회 (비동기 처리)
      try {
        const groups = await Group.find({ _id: { $in: userGroup.groups } });
        console.log('조회된 그룹 정보:', groups);
        // 여기서 groups에 조회된 그룹 정보가 배열로 포함됩니다.
      } catch (err) {
        console.error(err);
        // 오류 처리
      }
    } else {
      console.log('사용자를 찾을 수 없습니다.');
      // 사용자를 찾지 못한 경우에 대한 처리
    }
    res.status(200).send({ isSuccess: true, code: 200, study_groups: groups });
  } catch (err) {
    console.error(err);
    // 에러가 발생한 경우 서버 오류 메시지와 HTTP 상태 코드 500 반환
    res.status(500).send({ isSuccess: false, code: 500, error: '서버에서 오류가 발생했습니다.' });
  }
};
//그룹을 요청하는 함수
exports.joinGroupRequest = async (req, res) => {
  try {
    const userId = '6544c1c66a2fc789f82393cf'; // 다른 사용자
    const { groupId } = req.params; // 가입하려는 group의 object Id

    // 사용자 업데이트
    const user = await User.findById(userId);
    if (user) {
      user.pending_groups.push({ group: groupId });
      await user.save();
    }

    // 그룹 업데이트
    const group = await Group.findById(groupId);
    if (group) {
      group.join_requests.push({ user_id: userId });
      await group.save();
    }

    console.log('유저는', user);
    console.log('그룹은', group);

    res.status(200).send({
      isSuccess: true,
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

//그룹 요청 수락 기능 함수
exports.acceptGroupMembershipRequest = async (req, res) => {
  const userId = '6544c1c66a2fc789f82393cf';
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group || !user) {
      return res.status(404).send({
        isSuccess: false,
        error: '그룹 또는 사용자를 찾을 수 없습니다.',
      });
    }

    // 그룹의 join_requests에서 requestId에 해당하는 문서를 찾아서 삭제
    group.join_requests = group.join_requests.filter(request => request.user_id.toString() !== userId);

    // 그룹의 멤버로 사용자 추가
    group.members.push(userId);

    // 사용자의 pending_groups에서 groupId에 해당하는 문서를 찾아서 삭제
    user.pending_groups = user.pending_groups.filter(groupRequest => groupRequest.group.toString() !== groupId);

    // 사용자의 그룹 목록에 groupId 추가
    user.groups.push(groupId);

    await group.save();
    await user.save();

    return res.status(200).send({
      isSuccess: true,
      message: '그룹 멤버십 요청을 성공적으로 수락했습니다.',
    });
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
  const userId = '6544c1c66a2fc789f82393cf';
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (!group || !user) {
      return res.status(404).send({
        isSuccess: false,
        error: '그룹 또는 사용자를 찾을 수 없습니다.',
      });
    }

    // 그룹의 join_requests에서 requestId에 해당하는 문서를 찾아서 삭제
    group.join_requests = group.join_requests.filter(request => request.user_id.toString() !== userId);

    // 사용자의 pending_groups에서 groupId에 해당하는 문서를 찾아서 삭제
    user.pending_groups = user.pending_groups.filter(groupRequest => groupRequest.group.toString() !== groupId);

    await group.save();
    await user.save();

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
    // const userId = res.locals.decoded.userInfo.id;
    const userId = '6544c1dca28767bd46ee53f4';
    // 클라이언트에서 요청으로 받은 데이터 추출
    const { name, password, description, category, dailyGoalTime, maximumNumberMember, isCameraOn } = req.body;
    // TODO: 유저의 카테고리 그룹생성시 default로 박기??
    // TODO: multer file path -> client와 붙이면서 확인
    // const { filename } = req.file;
    // path == 이미지를 받을 수 있는 URL
    // const imagePath = `/api/static/profileImg/${filename}`;
    const newGroup = new Group({
      group_leader: userId, //그룹장의 user objectId
      group_name: name, // 그룹 이름
      group_password: password, // 비밀번호
      group_description: description, // 그룹 설명
      group_category: category, //카테고리
      // group_image_path: imagePath, //그룹 프로필 이미지
      daily_goal_time: dailyGoalTime, // 일일 목표 시간
      group_maximum_member: maximumNumberMember, // 최대 회원 수
      is_camera_on: isCameraOn, // 카메라 상태
      members: userId,
    });

    // 그룹 저장
    const savedGroup = await newGroup.save();

    // 사용자를 찾아서 사용자의 groups 배열에 새 그룹 ObjectId를 추가
    const user = await User.findById(userId);
    user.groups.push(savedGroup._id); // 새 그룹의 ObjectId를 추가
    console.log('savedGroup은', savedGroup);
    // 사용자 업데이트 및 저장
    await user.save();

    // HTTP 상태 코드 201 (Created)와 함께 새 그룹 정보를 클라이언트에 반환
    res.status(201).send({
      isSuccess: true,
      code: 201,
      message: '스터디 그룹이 성공적으로 생성되었습니다.',
      groupLeader: user.nick_name,
      data: newGroup,
    });
  } catch (err) {
    // 오류 발생 시 HTTP 상태 코드 500 (Internal Server Error)와 함께 오류 정보를 클라이언트에 반환
    res.status(500).send({ isSuccess: false, code: 500, err });
  }
};

exports.patchGroupInformation = async (req, res) => {
  try {
    // 요청 파라미터에서 그룹 ID를 가져옴
    const { groupId } = req.params;

    // 요청 본문에서 그룹 정보 업데이트를 위한 필드들을 가져옴
    const {
      name, // 그룹 이름
      password, // 비밀번호
      description, // 그룹 설명
      category, // 그룹의 카테고리 이름 (User FK 값)
      imagePath, // 그룹 프로필 이미지 경로
      dailyGoalTime, // 일일 목표 시간
      maximumNumberMember, // 최대 회원 수
      isCameraOn, // 카메라 상태
    } = req.body;

    // 그룹 정보 업데이트 수행
    const updatedFields = {
      group_name: name,
      group_password: password,
      group_description: description,
      group_category: category,
      group_image_path: imagePath,
      daily_goal_time: dailyGoalTime,
      group_maximum_member: maximumNumberMember,
      is_camera_on: isCameraOn,
    };
    //그룹 업데이트
    const updatedGroup = await Group.findByIdAndUpdate(groupId, updatedFields, { new: true });
    if (updatedGroup) {
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
    console.log('실행');
    const userId = '6544c1c66a2fc789f82393cf';
    // 요청 파라미터에서 그룹 ID를 가져옴
    const { groupId } = req.params;

    // 그룹 삭제 수행
    const deletedGroup = await Group.findById(groupId);

    if (deletedGroup) {
      // 사용자의 groups 필드에서도 삭제해야 합니다.
      await User.updateOne({ _id: userId }, { $pull: { groups: groupId } });
      await Group.updateOne({ _id: groupId }, { $pull: { members: userId } });

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

    // 그룹의 members 배열을 비움
    const updatedGroup = await Group.findByIdAndUpdate(groupId, { $set: { members: [] } });

    if (!updatedGroup) {
      return res.status(404).send({ isSuccess: false, error: '그룹을 찾을 수 없습니다.' });
    }

    // 그룹의 members 배열에서 각 멤버를 가져와서 해당 그룹을 삭제
    const groupMembers = updatedGroup.members;
    for (const memberId of groupMembers) {
      // 멤버의 groups 배열에서 해당 그룹을 삭제
      await User.findByIdAndUpdate(memberId, { $pull: { groups: groupId } });
    }
    // 그룹 스키마의 다큐먼트 삭제
    await Group.findByIdAndDelete(groupId);
    res.status(200).send({ isSuccess: true, message: '그룹에서 모든 멤버를 삭제했습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ isSuccess: false, error: '서버 오류가 발생했습니다.' });
  }
};
