const { Group } = require('../models');
const Sequelize = require('sequelize');

exports.postGroupInformation = async (req, res) => {
  try {
    const { name, password, description, category, dailyGoalTime, maximumNumberMember, isCameraOn } = req.body;
    //TODO 그룹장 정보 넣기
    const newGroup = await Group.create({
      name: name,
      password: password,
      description: description,
      category_name: category,
      daily_goal_time: dailyGoalTime,
      maximum_number_member: maximumNumberMember,
      is_camera_on: isCameraOn,
    });
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json(err);
  }
};
