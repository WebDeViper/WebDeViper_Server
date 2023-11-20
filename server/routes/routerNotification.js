const express = require('express');
const router = express.Router();
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const controller = require('../controller/ctrNotification');
//공지사항읽었을 떄
router.patch('/notification', verifyJwtToken, controller.patchNoticeNotification);
// router.patch('/notification', controller.patchNoticeNotification);

module.exports = router;
