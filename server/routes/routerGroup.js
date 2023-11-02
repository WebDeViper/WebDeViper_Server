const express = require('express');
const router = express.Router();
// const controller = require('../controller/ctrGroup');
const test = require('../controller/ctrGroupMongoose');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

// //현재 로그인한 유저의 카테고리내에서 그룹조회
// router.get('/studyGroups', verifyJwtToken, controller.getCategoryGroups);
// // 현재 로그인한 유저가 속한 스터디 그룹을 조회
// router.get('/studyGroups/users', verifyJwtToken, controller.getCategoryGroupsByUser);
// //그룹 요청 기능
// router.post('/studyGroup/:groupId/join', verifyJwtToken, controller.joinGroupRequest);
// //그룹 생성 기능
// router.post('/studyGroup', verifyJwtToken, controller.postGroupInformation);
// //그룹 옵션 수정 기능
// router.patch('/studyGroup/:groupId', verifyJwtToken, controller.patchGroupInformation);
// //그룹 삭제 기능
// router.delete('/studyGroup/:groupId', verifyJwtToken, controller.deleteGroup);

//////////mongoose 버전 테스트
//현재 로그인한 유저의 카테고리내에서 그룹조회
router.get('/studyGroups/test', test.getCategoryGroups);
// 현재 로그인한 유저가 속한 스터디 그룹을 조회
// router.get('/studyGroups/users/test', verifyJwtToken, test.getCategoryGroupsByUser);
// //그룹 요청 기능
// router.post('/studyGroup/:groupId/join/test', verifyJwtToken, test.joinGroupRequest);
// //그룹 생성 기능
// router.post('/studyGroup/test', verifyJwtToken, test.postGroupInformation);
// //그룹 옵션 수정 기능
// router.patch('/studyGroup/:groupId/test', verifyJwtToken, test.patchGroupInformation);
// //그룹 삭제 기능
// router.delete('/studyGroup/:groupId/test', verifyJwtToken, test.deleteGroup);

module.exports = router;
