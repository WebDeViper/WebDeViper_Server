const multer = require('multer');
const path = require('path'); //경로에 관한 내장 모듈
const upload = multer({
  dest: 'img/profile/', // dest: 클라이언트가 업로드한 파일을 저장할 서버측 경로
});
const uploadDetail = multer({
  // storage : 저장할 공간에 대한 정보
  //done(null,xx) 여기서 null은 error를 의미하는 매개변수
  //에러가 없으므로 "null" 이라고 전달하여 콜백 함수를 호출!
  storage: multer.diskStorage({
    destination(req, file, done) {
      //done은 callback 함수
      done(null, 'public/img/profile/'); //파일을 업로드할 경로 설정
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname); //파일 "확장자"를 주출(png,txt,...)
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  //   limits : 파일 제한 정보
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});
