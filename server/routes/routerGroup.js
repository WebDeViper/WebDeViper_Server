const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrGroup');

//그룹조회
// router.get('', controller.함수명);
router.post('/studyGroup', controller.postGroupInformation);
module.exports = router;
