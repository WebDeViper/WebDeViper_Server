const { Todo, Sequelize } = require('../models');

const getUserIdFromToken = res => {
  return res.locals.decoded.userInfo.id;
};

const checkLoginStatus = (userId, res) => {
  if (!userId) {
    res.status(401).send({ message: '로그인 후 이용해주세요.' });
    return false;
  }
  return true;
};

exports.getTodoList = async (req, res) => {
  try {
    const currentUserId = getUserIdFromToken(res);
    if (!checkLoginStatus(currentUserId, res)) {
      return;
    }

    const result = await Todo.findAll({ where: { user_id: currentUserId } });
    res.status(200).send({ todos: result, message: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'SERVER ERROR' });
  }
};

exports.postTodo = async (req, res) => {
  try {
    const currentUserId = getUserIdFromToken(res);
    if (!checkLoginStatus(currentUserId, res)) {
      return;
    }

    // 시간 설정
    const startTime = new Date(req.body.start_time);
    const endTime = new Date(req.body.end_time);

    const newTodo = await Todo.create({
      user_id: currentUserId,
      title: req.body.title,
      content: req.body.content,
      start_time: startTime,
      end_time: endTime,
    });

    res.status(200).send({ result: newTodo, message: '할 일이 성공적으로 등록되었습니다!' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'SERVER ERROR' });
  }
};

exports.patchTodo = async (req, res) => {
  try {
    const currentUserId = getUserIdFromToken(res);
    if (!checkLoginStatus(currentUserId, res)) {
      return;
    }

    // const { todo_id } = req.query;
    const { todo_id } = req.params;
    const { done, start_time, end_time, content, title } = req.body;

    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    const [updatedRowCount] = await Todo.update(
      {
        title,
        start_time: startTime,
        content,
        end_time: endTime,
        updated_at: new Date(),
        done: done,
      },
      {
        where: {
          todo_id: todo_id,
          user_id: currentUserId,
        },
      }
    );

    if (updatedRowCount > 0) {
      res.status(200).send({ message: 'Todo가 업데이트되었습니다.', updatedRowCount });
    } else if (updatedRowCount === 0) {
      res.status(204).send(); // update된 게 없을 때 보냄
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
    const currentUserId = getUserIdFromToken(res);
    if (!checkLoginStatus(currentUserId, res)) {
      return;
    }

    const deletedRowCount = await Todo.destroy({
      where: {
        todo_id: req.params.todo_id,
        user_id: currentUserId,
      },
    });

    if (deletedRowCount > 0) {
      res.status(200).send({ message: '할 일이 성공적으로 삭제되었습니다.', deletedRowCount });
    } else {
      res.status(400).send({ message: '할 일 삭제에 실패하였습니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: '서버 오류' });
  }
};
