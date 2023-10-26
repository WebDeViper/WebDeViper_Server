const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrTodo');
//컨트롤러
router.get('/todo_lists/:user_id', controller.getTodoList);
router.post('/todo_list/:user_id', controller.postTodo);
router.patch('/todo_lists/:user_id', controller.patchTodo);
router.delete('/todo_lists/:user_id', controller.deleteTodo);
module.exports = router;
