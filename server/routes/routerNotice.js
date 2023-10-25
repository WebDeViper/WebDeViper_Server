const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrNotice');
// 컨트롤러
router.get('/notices', controller.getNotice);
router.post('/notice', controller.postNotice);
router.patch('/notice', controller.patchNotice);
router.delete('/notice', controller.deleteNotice);
module.exports = router;
