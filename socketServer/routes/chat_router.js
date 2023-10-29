const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrTimer.js');

router.get('/timer', controller.getTimer);
router.module.exports = router;
