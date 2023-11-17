const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrTodo');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

router.get('/todo_lists', verifyJwtToken, controller.getTodoList);
router.post('/todo_list', verifyJwtToken, controller.postTodo);
router.patch('/todo_lists', verifyJwtToken, controller.patchTodo);
router.delete('/todo_list', verifyJwtToken, controller.deleteTodo);
// router.get('/todo_lists', controller.getTodoList);
// router.post('/todo_list', controller.postTodo);
// router.patch('/todo_lists', controller.patchTodo);
// router.delete('/todo_list', controller.deleteTodo);

module.exports = router;
