const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrTodo');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
//컨트롤러
// router.get('/todo_lists/:user_id', verifyJwtToken, controller.getTodoList);
// router.post('/todo_list/:user_id', verifyJwtToken, controller.postTodo);
// router.patch('/todo_lists/:user_id', verifyJwtToken, controller.patchTodo);
// router.delete('/todo_lists/:user_id', verifyJwtToken, controller.deleteTodo);
router.get('/todo_lists', controller.getTodoList);
router.post('/todo_list', verifyJwtToken, controller.postTodo);
router.patch('/todo_lists', verifyJwtToken, controller.patchTodo);
router.delete('/todo_list', verifyJwtToken, controller.deleteTodo);
module.exports = router;
