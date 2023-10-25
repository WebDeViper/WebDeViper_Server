const { Group } = require('../models');
const Sequelize = require('sequelize');

exports.postGroupInformation = async (req, res) => {
  try {
    // 클라이언트에서 요청으로 받은 데이터 추출
    const { name, password, description, category, dailyGoalTime, maximumNumberMember, isCameraOn } = req.body;
    // TODO: 그룹장 정보 넣기 (그룹장 정보를 어떻게 처리할지에 대한 내용을 추가로 구현해야 함)
    // Sequelize 모델을 사용하여 새 그룹 생성
    const newGroup = await Group.create({
      name: name, // 그룹 이름
      password: password, // 비밀번호
      description: description, // 설명
      category_name: category, // 그룹의 카테고리 이름 (ENUM 값)
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
    const { groupId } = req.query;
  } catch (err) {}
};
