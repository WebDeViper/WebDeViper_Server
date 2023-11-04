const { Todo } = require('../schemas/schema');
const mongoose = require('mongoose');

exports.getTodoList = async (req, res) => {
  try {
    // 토큰값에서 user_id 가져옴
    // const currentUserId = res.locals.decoded.userInfo.id;
    const currentUserId = '6544d9eeaabd61b4d1cf4bc5';

    if (req.query) {
      // console.log('query>>', req.query); // month, year

      // const year = req.query.year; // 예: '2023' 형식으로 전달된다고 가정
      // const month = req.query.month; // 예: '08' 형식으로 전달된다고 가정

      const result = await Todo.find({
        user_id: currentUserId,
      });

      const todos = result.map(todo => todo.toObject());
      console.log(todos);
      res.status(200).send(todos);
    } else {
      res.status(400).send({ message: '사용자 정보가 없습니다.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'SERVER ERROR' });
  }
};

exports.postTodo = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544d9eeaabd61b4d1cf4bc5';

    const newTodo = new Todo({
      user_id: currentUserId,
      title: req.body.title,
      content: req.body.content,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });

    const result = await newTodo.save();
    res.status(200).send({ result, message: '할 일이 성공적으로 등록되었습니다!' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'SERVER ERROR' });
  }
};

exports.patchTodo = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544d9eeaabd61b4d1cf4bc5';
    const { todo_objId } = req.query;
    const { done, start_time, end_time, content, title } = req.body;
    const updatedTodoData = {
      title,
      start_time,
      content,
      end_time,
      updated_at: new Date(),
      // done: done,
    };

    const result = await Todo.updateOne(
      {
        _id: todo_objId,
        user_id: currentUserId, // Ensure the user owns this todo
      },
      updatedTodoData
    );
    console.log(result);
    if (result.modifiedCount === 1) {
      res.status(200).send({ message: 'Todo가 업데이트되었습니다.' });
    } else if (result.modifiedCount === 0) {
      res.status(204); //update된 게 없을 때 보냄
    } else {
      res.status(404).send({ message: '해당 Todo를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: '서버 오류' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const currentUserId = res.locals.decoded.userInfo.id;
    // const currentUserId = '6544d9eeaabd61b4d1cf4bc5';
    const result = await Todo.deleteOne({
      _id: req.query.todo_objId,
      user_id: currentUserId, // Ensure the user owns this todo
    });
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).send({ message: '메시지가 성공적으로 삭제되었습니다.' });
    } else {
      res.status(400).send({ message: '메시지 삭제에 실패하였습니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: 'SERVER ERROR' });
  }
};
