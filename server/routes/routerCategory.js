const express = require('express');
const router = express.Router();
const ctrCategory = require('../controller/ctrCategory');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

// 현재 유저의 카테고리에서 랭킹 조회
router.get('/', verifyJwtToken, ctrCategory.getCategoryRank);
