const express = require('express');
const router = express.Router();
const controller = require('../controller/ctrTodo');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');

router.get('/todo_lists', verifyJwtToken, controller.getTodoList);
router.post('/todo_list', verifyJwtToken, controller.postTodo);
router.patch('/todo_lists/:todo_id', verifyJwtToken, controller.patchTodo);
router.delete('/todo_list/:todo_id', verifyJwtToken, controller.deleteTodo);
// router.get('/todo_lists', controller.getTodoList);
// router.post('/todo_list', controller.postTodo);
// router.patch('/todo_lists/:todo_id', controller.patchTodo);
// router.delete('/todo_list/:todo_id', controller.deleteTodo);

module.exports = router;
