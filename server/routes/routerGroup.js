const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrGroup');

//그룹조회
// router.get('', controller.함수명);
router.post('/studyGroup', controller.postGroupInformation);
router.patch('/studyGroup/:groupId', controller.patchGroupInformation);
router.delete('/studyGroup/:groupId', controller.deleteGroup);
module.exports = router;
