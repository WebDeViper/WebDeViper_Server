const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrGroup');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

//현재 로그인한 유저의 카테고리내에서 그룹조회
router.get('/studyGroups', verifyJwtToken, controller.getCategoryGroups);
// 현재 로그인한 유저가 속한 스터디 그룹을 조회
router.get('/studyGroups/users', verifyJwtToken, controller.getCategoryGroupsByUser);

//그룹 생성 기능
router.post('/studyGroup', verifyJwtToken, controller.postGroupInformation);
//그룹 옵션 수정 기능
router.patch('/studyGroup/:groupId', verifyJwtToken, controller.patchGroupInformation);
//그룹 삭제 기능
router.delete('/studyGroup/:groupId', verifyJwtToken, controller.deleteGroup);

module.exports = router;
