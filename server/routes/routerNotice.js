const express = require('express');
const router = express.Router();
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const { isAdmin } = require('../middlewares/isAdmin');
const controller = require('../controller/ctrNotice');
// 컨트롤러
router.get('/notices', controller.getNotice);
// router.get('/notices', controller.getNotice);
router.get('/notice/:notice_id', controller.getNoticeDetail);
router.post('/notice', verifyJwtToken, isAdmin, controller.postNotice);
// router.post('/notice', controller.postNotice);
router.patch('/notice/:notice_id', verifyJwtToken, isAdmin, controller.patchNotice);
// router.patch('/notice/:notice_id', controller.patchNotice);
router.delete('/notice/:notice_id', verifyJwtToken, isAdmin, controller.deleteNotice);
// router.delete('/notice/:notice_id', controller.deleteNotice);

module.exports = router;
