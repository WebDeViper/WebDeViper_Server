// bcrypt
// 비밀번호 암호화 알고리즘 중 하나, 주로 강력한 보안이 필요할 때 사용(자원을 많이 씀),
// blowfish 암호를 기반으로 설계된 단방향 암호화 함수 (원본데이터 복원기능 없음)
const bcrypt = require('bcrypt');

// const originalPassword = '1234';

// password 해싱 함수
exports.hashPassword = password => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

// 원문 비밀번호와 해시된 비밀번호가 일치하는 확인하는 함수
exports.comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

// const hashedPassword = hashPassword(originalPassword);
// console.log(hashedPassword);

// const isMatch = comparePassword('1234', hashedPassword);
// console.log(isMatch);

// const isMatch = comparePassword('1234zzz', hashedPassword);
// console.log(isMatch);
