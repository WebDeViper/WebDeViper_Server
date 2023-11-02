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
      }
      console.log(groups);
    } else {
      console.log('사용자를 찾을 수 없습니다.');
      // 사용자를 찾을 수 없는 경우에 대한 처리
    }

    //       // 일치하는 그룹이 하나 이상 있는 경우
    //       if (group.length > 0) {
    //         selectedCategoryGroup = group.map(group => group.dataValues);
    //         // 선택한 카테고리에 속하는 그룹이 하나 이상 있는 경우
    //         if (selectedCategoryGroup.length > 0) {
    //           const groupIds = selectedCategoryGroup.map(group => group.group_id);

    //           const groupManager = await GroupMember.findOne({
    //             where: { group_id: groupIds, is_admin: true },
    //             attributes: ['user_id'],
    //           });

    //           if (groupManager) {
    //             // 그룹 관리자가 존재할 때
    //             res.status(200).send({
    //               isSuccess: true,
    //               code: 200,
    //               study_groups: selectedCategoryGroup,
    //               groupManager: groupManager.dataValues.user_id,
    //             });
    //           } else {
    //             // 그룹관리자가 존재하지 않을 때
    //             res.status(404).send({
    //               isSuccess: false,
    //               code: 404,
    //               error: '그룹 관리자를 찾을 수 없습니다.',
    //             });
    //           }
    //         } else {
    //           // 해당 카테고리의 스터디 그룹이 존재하지 않을 때
    //           res.status(204).send({
    //             isSuccess: false,
    //             code: 204,
    //             error: '해당하는 카테고리의 그룹이 없습니다.',
    //           });
    //         }
    //       } else {
    //         // 해당 카테고리의 스터디 그룹이 존재하지 않을 때
    //         selectedCategoryGroup = '해당하는 카테고리의 그룹이 없습니다.';
    //         res.status(204).send({
    //           isSuccess: false,
    //           code: 204,
    //           study_groups: selectedCategoryGroup,
    //           error: '해당하는 카테고리의 그룹이 없습니다.',
    //         });
    //       }
    //     }
  } catch (err) {
    // 에러가 발생한 경우 서버 오류 메시지와 HTTP 상태 코드 500 반환
    console.error(err);
    // res.status(500).send({ isSuccess: false, code: 500, error: err });
  }
};

// 사용자별 그룹 목록을 반환하는 함수
exports.getCategoryGroupsByUser = async (req, res) => {
  try {
    const userId = res.locals.decoded.userInfo.id;

    // 사용자의 그룹 ID 목록을 조회
    const userGroupIds = await GroupMember.findAll({
      where: { user_id: userId },
      attributes: ['group_id'],
    });

    const userGroupsData = [];

    // 사용자가 속한 그룹이 하나 이상 있는 경우
    if (userGroupIds.length > 0) {
      const groupIds = userGroupIds.map(member => member.dataValues.group_id);

      // 그룹 ID 목록을 사용하여 사용자의 그룹 목록을 조회
      const userGroups = await Group.findAll({
        where: { group_id: groupIds },
      });

      // 조회된 그룹 데이터를 사용자가 속한 그룹 데이터로 변환
      userGroupsData.push(...userGroups.map(group => group.dataValues));

      // 그룹 관리자를 찾아 배열로 초기화
      const groupManager = await GroupMember.findAll({
        where: { group_id: groupIds, is_admin: true },
        attributes: ['user_id'],
      });

      // 사용자가 속한 그룹 관리자 목록을 추가
      userGroupsData.push({ groupManager: groupManager.map(manager => manager.dataValues.user_id) });
    }

    // HTTP 상태 코드 200과 사용자 그룹 데이터를 JSON 응답으로 반환
    res.status(200).send({ isSuccess: true, code: 200, study_groups: userGroupsData });
  } catch (err) {
    console.error(err);
    // 에러가 발생한 경우 서버 오류 메시지와 HTTP 상태 코드 500 반환
    res.status(500).send({ isSuccess: false, code: 500, error: '서버에서 오류가 발생했습니다.' });
  }
};

// 새 그룹 생성하는 함수
exports.postGroupInformation = async (req, res) => {
  try {
    //그룹을 생성하는 유저의 아이디 -> 그룹장
    const userId = res.locals.decoded.userInfo.id;
    // 클라이언트에서 요청으로 받은 데이터 추출
    const { name, password, description, category, imagePath, dailyGoalTime, maximumNumberMember, isCameraOn } =
      req.body;
    // TODO: 그룹장 정보 넣기 (그룹장 정보를 어떻게 처리할지에 대한 내용을 추가로 구현해야 함)
    // TODO: 유저의 카테고리 그룹생성시 default로 박기
    // TODO: multer file path -> client와 붙이면서 확인
    // Sequelize 모델을 사용하여 새 그룹 생성
    const newGroup = new Group({
      group_leader: userId, //그룹장의 user objectId
      group_name: name, // 그룹 이름
      group_password: password, // 비밀번호
      group_description: description, // 그룹 설명
      group_category: category, //카테고리
      group_image_path: imagePath, //그룹 프로필 이미지
      daily_goal_time: dailyGoalTime, // 일일 목표 시간
      group_maximum_member: maximumNumberMember, // 최대 회원 수
      is_camera_on: isCameraOn, // 카메라 상태
    });
    newGroup.save((err, group) => {
      if (err) {
        console.error(err);
      } else {
        console.log('그룹이 생성되었습니다.');
        console.log(group);
      }
    });
    const user = await User.findById(userId);
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
    const patchGroup = await Group.update(
      {
        name: name,
        password: password,
        description: description,
        group_category_name: category,
        group_image_path: imagePath,
        daily_goal_time: dailyGoalTime,
        maximum_number_member: maximumNumberMember,
        is_camera_on: isCameraOn,
      },
      { where: { group_id: groupId } }
    );

    // 업데이트된 그룹 정보 조회
    const modifiedGroup = await Group.findOne({
      where: { group_id: groupId },
    });

    if (patchGroup) {
      // 업데이트가 성공했을 경우
      res.status(200).send({ isSuccess: true, code: 200, data: modifiedGroup });
    } else {
      // 업데이트에 실패했을 경우 (상태코드 400과 메시지 반환)
      res.status(400).send({ isSuccess: false, code: 400, error: '업데이트에 실패했습니다.' });
    }
  } catch (err) {
    // 서버 오류가 발생한 경우 (상태코드 500과 에러 메시지 반환)
    res.status(500).send({ isSuccess: false, code: 500, error: err });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    // 요청 파라미터에서 그룹 ID를 가져옴
    const { groupId } = req.params;

    // 그룹 삭제 수행
    const deleteGroup = await Group.destroy({
      where: { group_id: groupId },
    });

    if (deleteGroup) {
      // 삭제가 성공했을 경우
      res.status(204).send({ isSuccess: true, code: 204, msg: '스터디 그룹을 삭제했습니다.' });
    } else {
      // 삭제에 실패했을 경우 (상태코드 400과 에러 메시지 반환)
      res.status(400).send({ isSuccess: false, code: 400, error: error });
    }
  } catch (err) {
    // 서버 오류가 발생한 경우 (상태코드 500과 에러 메시지 반환)
    res.status(500).send({ isSuccess: false, code: 500, error: err });
  }
};
