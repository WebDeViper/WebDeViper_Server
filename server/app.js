const dotenv = require('dotenv');
dotenv.config();
const { PORT } = process.env;
const express = require('express');
const { sequelize } = require('./models/index');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // cookie-parser 미들웨어를 사용하여 쿠키를 파싱합니다. // 쿠키에 JWT를 넣어서 보내보려고

// const routerUser = require('./routes/routerUser');
// app.use('/api/user', routerUser);
app.use('/', indexRouter);

// 에러처리 하는 미들웨어를 사용하는걸로 업그레이드 해보기..
app.get('*', (req, res) => {
  res.render('404');
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`server open on port ${PORT}`);
  });
});
