const { Group, User, GroupMember } = require('../models');
const Sequelize = require('sequelize');

exports.getCategoryRank = async (req, res) => {
  // 토큰에서 현재유저정보 가져오기
  const userInfo = res.locals.decoded.userInfo;

  // 쿼리에서 몇등까지 랭킹 가져올지
  const count = req.query.count || 10;

  // 그룹을 받아오면 좋을것 같은데
  // 그룹값이 없으면 카테고리 전체에서 랭킹을 가져오고
  // 그룹값이 있으면 그룹안에서 랭킹을 가져오자
  const groupId = req.query.groupId || 1;

  // 랭킹을 계산
  // 누적 공부량을 가지고 랭킹을 계산
  // ..몽고에서 가져와..?
  // ..Mysql에서 가져와..?

  // 보내줄 랭킹 데이터
  const rank = [
    {
      userId: 10,
      userNick: '김태균10',
      userImg: 'example10', // 유저의 프로필 이미지
      totalMilliseconds: 600000, // 10분, 누적 부량
      groupImg: 'example10', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 9,
      userNick: '김태균9',
      userImg: 'example9', // 유저의 프로필 이미지
      totalMilliseconds: 540000, // 9분, 누적 부량
      groupImg: 'example9', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 8,
      userNick: '김태균8',
      userImg: 'example8', // 유저의 프로필 이미지
      totalMilliseconds: 480000, // 8분, 누적 부량
      groupImg: 'example8', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 7,
      userNick: '김태균7',
      userImg: 'example7', // 유저의 프로필 이미지
      totalMilliseconds: 420000, // 7분, 누적 부량
      groupImg: 'example7', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 6,
      userNick: '김태균6',
      userImg: 'example6', // 유저의 프로필 이미지
      totalMilliseconds: 360000, // 6분, 누적 부량
      groupImg: 'example6', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 5,
      userNick: '김태균5',
      userImg: 'example5', // 유저의 프로필 이미지
      totalMilliseconds: 300000, // 5분, 누적 부량
      groupImg: 'example5', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 4,
      userNick: '김태균4',
      userImg: 'example4', // 유저의 프로필 이미지
      totalMilliseconds: 240000, // 4분, 누적 부량
      groupImg: 'example4', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 3,
      userNick: '김태균3',
      userImg: 'example3', // 유저의 프로필 이미지
      totalMilliseconds: 180000, // 3분, 누적 부량
      groupImg: 'example3', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 2,
      userNick: '김태균2',
      userImg: 'example2', // 유저의 프로필 이미지
      totalMilliseconds: 120000, // 2분, 누적 부량
      groupImg: 'example2', // 유저가 속한 그룹의 기본이미지 경로
    },
    {
      userId: 1,
      userNick: '김태균1',
      userImg: 'example1', // 유저의 프로필 이미지
      totalMilliseconds: 60000, // 1분, 누적 부량
      groupImg: 'example1', // 유저가 속한 그룹의 기본이미지 경로
    },
  ];

  // 응답
  res.send({
    rank,
  });
};
