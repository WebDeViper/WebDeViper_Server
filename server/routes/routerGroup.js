const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrGroup');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

//그룹조회
// router.get('/studyGroups',verifyJwtToken ,controller.getCategoryGroups);
router.get('/studyGroups', controller.getCategoryGroups);
//그룹 생성 기능
router.post('/studyGroup', controller.postGroupInformation);
//그룹 옵션 수정 기능
router.patch('/studyGroup/:groupId', controller.patchGroupInformation);
//그룹 삭제 기능
router.delete('/studyGroup/:groupId', controller.deleteGroup);

module.exports = router;
