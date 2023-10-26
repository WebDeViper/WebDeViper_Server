const { Group, User } = require('../models');
const Sequelize = require('sequelize');

exports.getCategoryGroups = async (req, res) => {
  try {
    const userId = req.headers.authorization || 1; // undefined라면 1
    const userCategory = await User.findOne({
      where: { user_id: userId },
      attributes: ['user_category_name'],
    });

    if (userCategory) {
      const userCategoryName = userCategory.dataValues.user_category_name;
      console.log('카테고리는', userCategoryName);

      const group = await Group.findAll({
        where: { group_category_name: userCategoryName },
      });

      let selectedCategoryGroup;
      if (group.length > 0) {
        selectedCategoryGroup = group.map(group => group.dataValues);
      } else {
        selectedCategoryGroup = '해당하는 카테고리의 그룹이 없습니다.';
      }

      res.status(200).json({ study_groups: [selectedCategoryGroup] });
    } else {
      console.log('사용자 카테고리를 찾을 수 없음');
      res.status(404).json({ error: '사용자 카테고리를 찾을 수 없음' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.postGroupInformation = async (req, res) => {
  try {
    // 클라이언트에서 요청으로 받은 데이터 추출
    const { name, password, description, category, imagePath, dailyGoalTime, maximumNumberMember, isCameraOn } =
      req.body;
    // TODO: 그룹장 정보 넣기 (그룹장 정보를 어떻게 처리할지에 대한 내용을 추가로 구현해야 함)
    // TODO: 유저의 카테고리 그룹생성시 default로 박기
    // TODO: multer file path -> client와 붙이면서 확인
    // Sequelize 모델을 사용하여 새 그룹 생성
    const newGroup = await Group.create({
      name: name, // 그룹 이름
      password: password, // 비밀번호
      description: description, // 그룹 설명
      group_category_name: category, //카테고리
      group_image_path: imagePath, //그룹 프로필 이미지
      daily_goal_time: dailyGoalTime, // 일일 목표 시간
      maximum_number_member: maximumNumberMember, // 최대 회원 수
      is_camera_on: isCameraOn, // 카메라 상태
    });
    // HTTP 상태 코드 201 (Created)와 함께 새 그룹 정보를 클라이언트에 반환
    res.status(201).json(newGroup);
  } catch (err) {
    // 오류 발생 시 HTTP 상태 코드 500 (Internal Server Error)와 함께 오류 정보를 클라이언트에 반환
    res.status(500).json(err);
  }
};

exports.patchGroupInformation = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, password, description, category, imagePath, dailyGoalTime, maximumNumberMember, isCameraOn } =
      req.body;
    const patchGroup = await Group.update(
      {
        name: name, // 그룹 이름
        password: password, // 비밀번호
        description: description, // 설명
        group_category_name: category, // 그룹의 카테고리 이름 (User FK 값)
        group_image_path: imagePath, //그룹 프로필 이미지
        daily_goal_time: dailyGoalTime, // 일일 목표 시간
        maximum_number_member: maximumNumberMember, // 최대 회원 수
        is_camera_on: isCameraOn, // 카메라 상태
      },
      { where: { group_id: groupId } }
    );
    const modifiedGroup = await Group.findOne({
      where: { group_id: groupId },
    });
    if (patchGroup) {
      //patchGroup 1이라면, -> 수정 성공시
      res.status(200).json(modifiedGroup);
    } else {
      res.status(400).json({ message: '상태코드 -> 400' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const deleteGroup = await Group.destroy({
      where: { group_id: groupId },
    });
    if (deleteGroup) {
      //deleteGroup 1이라면, -> 삭제 성공시
      res.status(204).json({ isSuccess: true });
    } else {
      res.status(400).json({ error: '상태코드 -> 400' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
