const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrTimer');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

router.get('/timer', verifyJwtToken, controller.getMyTimer);

module.exports = router;
