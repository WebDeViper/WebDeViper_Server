const express = require('express');
const router = express.Router();
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const { isAdmin } = require('../middlewares/isAdmin');
const controller = require('../controller/ctrNotice');
// 컨트롤러
router.get('/notices', verifyJwtToken, controller.getNotice);
// router.get('/notices', controller.getNotice);
router.get('/notice/:notice_id', verifyJwtToken, controller.getNoticeDetail);
router.post('/notice', verifyJwtToken, isAdmin, controller.postNotice);
router.patch('/notice', verifyJwtToken, isAdmin, controller.patchNotice);
router.delete('/notice', verifyJwtToken, isAdmin, controller.deleteNotice);

module.exports = router;
