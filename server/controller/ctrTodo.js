const { Todo, Sequelize } = require('../models');

exports.getTodoList = async (req, res) => {
  try {
    if (req.params) {
      console.log('params>>', req.params); // user_id
      console.log('query>>', req.query); // month, year

      const year = req.query.year; // 예: '2023' 형식으로 전달된다고 가정
      const month = req.query.month; // 예: '08' 형식으로 전달된다고 가정

      const result = await Todo.findAll({
        where: {
          user_id: req.params.user_id, // req.params에 있는 user_id 사용
          [Sequelize.Op.and]: [
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('created_at')), year),
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('created_at')), month),
          ],
        },
      });
      // result를 사용하여 연도 및 월 정보에 따라 필터링된 Todo 목록을 얻을 수 있습니다.
      const todos = result.map(item => item.dataValues);
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
  console.log(req.params);
  console.log(req.body);
  try {
    const result = await Todo.create({
      user_id: req.params.user_id,
      title: req.body.title,
    });
    res.status(200).send({ result, message: '할 일이 성공적으로 등록되었습니다!' });
  } catch (err) {
    console.log(err);
  }
};

exports.patchTodo = async (req, res) => {
  try {
    console.log(req.body.title);
    const { todo_index, date, done } = req.query;

    // Todo 모델에서 해당 todo_index와 created_at 값을 가진 Todo를 찾습니다.
    const todoToUpdate = await Todo.findOne({
      where: {
        todo_id: todo_index,
      },
    });

    if (todoToUpdate) {
      const updatedTodoData = {
        title: req.body.title,
        updated_at: new Date(),
        done: done, // updated_at을 업데이트하려면 적절한 값을 제공
      };

      // Todo를 업데이트
      await todoToUpdate.update(updatedTodoData);

      res.status(200).json({ message: 'Todo가 업데이트되었습니다.' });
    } else {
      // 해당 todo_index와 created_at을 가진 Todo를 찾지 못한 경우
      res.status(404).json({ message: '해당 Todo를 찾을 수 없습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
};
exports.deleteTodo = async (req, res) => {
  try {
    console.log(req.params.user_id);
    console.log(req.query.todo_index);
    const result = await Todo.destroy({
      where: {
        user_id: req.params.user_id,
        todo_id: req.query.todo_index,
      },
    });

    if (result) {
      res.status(204).json({ message: '메시지가 성공적으로 삭제되었습니다.' });
    } else {
      res.status(400).json({ message: '메시지 삭제에 실패하였습니다.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'SERVER ERROR' });
  }
};
