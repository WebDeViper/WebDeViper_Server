const multer = require('multer');
const path = require('path');
const sanitizeFilename = require('sanitize-filename');

// 유저 프로필 이미지 업로드된 파일을 저장할 디렉터리 및 파일명 설정
const userImgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../static/profileImg')); // 파일을 저장할 디렉터리
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const sanitizedFilename = sanitizeFilename(path.basename(file.originalname, ext));
    cb(null, sanitizedFilename + '__' + Date.now() + ext); // 파일명 설정 (유니크한 이름)
  },
});

// 유저 이미지 파일 필터 함수 정의 (이미지 파일만 허용)
const userImgFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/tiff', 'image/png', 'image/jpg', 'image/jpeg', 'image/png', 'image/gif']; // 허용할 이미지 MIME 타입 목록

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // 허용
  } else {
    const error = new Error('지원하지 않는 파일 형식입니다.');
    error.status = 411; // HTTP 상태 코드 설정
    error.code = 'UNSUPPORTED_FORMAT'; // 오류 코드 설정
    error.msg = '지원하지 않는 파일 형식입니다.'; // 오류 메시지 설정
    cb(error, false); // 에러 처리 미들웨어로 전달
    // cb(new Error('지원하지 않는 파일 형식입니다.'), false); // 거부
  }
};

// 프로필 이미지 파일 업로드를 처리할 Multer 인스턴스 생성
const userImgUploader = multer({
  storage: userImgStorage,
  fileFilter: userImgFileFilter, // 파일 필터 적용
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = {
  userImgUploader,
};
