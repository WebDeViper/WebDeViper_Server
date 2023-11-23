# Viper

&nbsp;

## 🖥️ 프로젝트 소개

<center><img src="./readme/img/viperImg.png" width="500" /> </center>

스터디 그룹 참여 및 그룹간 채팅이 가능한 커뮤니티 프로그램

&nbsp;

## 🕰️ 개발 기간

23.10.19일 - 23.11.10일

&nbsp;

## 시작 가이드

### Requirements

- [Node.js 20.7.0](https://www.npmjs.com/package/node/v/20.7.0)
- [Npm 10.2.0](https://www.npmjs.com/package/npm/v/10.2.0)

### Installation

#### Front-End

```bash
$ git clone https://github.com/WebDeViper/WebDeViper_Client2.git
```

```
$ npm i
$ npm run build
$ npm run dev
```

#### Back-End

```bash
$ git clone https://github.com/WebDeViper/WebDeViper_Server.git
```

```
$ npm i
$ node app
```

### 🧑‍🤝‍🧑 팀 구성

| 프론트 개발                                                                           | 프론트 개발                                                                           | 백엔드 개발                                                                           | 백엔드 개발                                                                           | 백엔드 개발                                                                           |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| <img src="./readme/img/profile1.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="./readme/img/profile1.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="./readme/img/profile1.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="./readme/img/profile1.jpeg" width="100px" height="100px" alt="이미지 설명"> | <img src="./readme/img/profile1.jpeg" width="100px" height="100px" alt="이미지 설명"> |
| [@sukmin](https://github.com/msm0748)                                                 | [@taehoon](https://github.com/hoonsdev)                                               | [@minyoung](https://github.com/HongMinYeong)                                          | [@seeun](https://github.com/seeun0210)                                                | [@taegyun](https://github.com/hotdog7778)                                             |
| 문석민                                                                                | 김태훈                                                                                | 홍민영                                                                                | 김세은                                                                                | 김태균                                                                                |

| 이름   | 담당 역할                             |
| ------ | ------------------------------------- |
| 문석민 | ~~~ 구현                              |
| 김태훈 | ~~~ 구현                              |
| 홍민영 | ~~~ 구현                              |
| 김세은 | ~~~ 구현                              |
| 김태균 | 회원가입, 유저인증(JWT), DB설계, 배포 |

&nbsp;

### ⚙️ 개발 환경

**[FE]**
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%6333AFB.svg?style=for-the-badge&logo=react&logoColor=%#61DAFB) ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)

**[BE]** ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

**[DB]** ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![MongoDB](https://img.shields.io/badge/mongodb-47A248.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Mongoose](https://img.shields.io/badge/mongoose-880000.svg?style=for-the-badge&logo=mysql&logoColor=white)

**[SERVER]**
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

**[COMMUNITY]**
![SLACK](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)
![NOTION](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
&nbsp;

## 📌 주요 기능

|                                                                           |                                                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 로그인                                                                    | 회원가입                                                                  |
| <img src="./readme/img/로그인.jpeg" width="300px" height="300px">         | <img src="./readme/img/회원가입.jpeg" width="300px" height="300px">       |
| 스터디 만들기                                                             | 스터디 참여하기                                                           |
| <img src="./readme/img/스터디만들기.jpeg" width="300px" height="300px">   | <img src="./readme/img/스터디참여하기.jpeg" width="300px" height="300px"> |
| 스터디 채팅하기                                                           | 스터디 탈퇴하기                                                           |
| <img src="./readme/img/스터디채팅하기.jpeg" width="300px" height="300px"> | <img src="./readme/img/스터디탈퇴하기.jpeg" width="300px" height="300px"> |
| 타이머                                                                    | 랭킹 조회                                                                 |
| <img src="./readme/img/타이머.jpeg" width="300px" height="300px">         | <img src="./readme/img/랭킹조회.jpeg" width="300px" height="300px">       |

## ERD

&nbsp;
<img src="./readme/img/ERD.jpeg" width="600px" height="600px">

## 와이어 프레임

&nbsp;
<img src="./readme/img/와이어프레임.jpeg" width="600px" height="600px">

&nbsp;

회원가입

- ID 및 닉네임 중복 체크
- 닉네임 비속어 필터
- 유효성 검사

&nbsp;

로그인

- DB 값 검증
- ID 찾기
- 비밀번호 재설정
  - 이메일 인증 여부에 따라 동작
- 로그인 시 세션( Session ) 생성

&nbsp;

스터디

- 로그인 여부에 따라 헤더 변경
- 캐러셀 링크 연동
- 게시판 별 최근 20개의 글 스와이퍼 형식으로 제공
- 각 게시글에 대한 좋아요, 조회수, 댓글 수 확인

&nbsp;

공부하러 가기

- CRUD
- 질문 유형별 태그 선택
- 질문에 대한 답변 작성
  - 답변에 대한 댓글 작성
- 좋아요 및 조회수 확인

&nbsp;

랭킹

- CRUD
- 댓글 작성
- 좋아요 및 조회수 확인

&nbsp;

마이페이지

- 프로필 사진 변경
- 활동 기록 조회 기능
  - 작성한 게시글 ( QnA / 자유 )
  - 댓글 작성한 게시글
  - 좋아요 누른 게시글

&nbsp;

공지사항

- 닉네임 중복 검사
- 비속어 필터
- 유효성 검사
- 회원 탈퇴

## 디렉토리 구조

```bash
├── README.md
├── api.http
├── app.js
├── config
│   ├── config.json
│   └── email.js
├── controller
│   ├── Canswer.js
│   ├── Cboard.js
│   ├── Ccomment.js
│   ├── Cmain.js
│   ├── Cprofile.js
│   ├── Cquestion.js
│   ├── Cupload.js
│   └── Cuser.js
├── middlewares
│   ├── badWordsFilter
│   │   └── badWordsFilter.js
│   ├── multer
│   │   └── multerConfig.js
│   ├── needToLogin.js
│   ├── session
│   │   └── session.js
│   └── swagger
│       ├── swagger.js
│       └── swaggerDefinition.json
├── models
│   ├── Answer.js
│   ├── Board.js
│   ├── Comment.js
│   ├── Like.js
│   ├── Question.js
│   ├── User.js
│   └── index.js
├── routes
│   ├── boardRouter.js
│   ├── index.js
│   ├── profileRouterToBeDelete.js
│   ├── questionRouter.js
│   ├── uploadRouter.js
│   └── usersRouter.js
├── static
│   ├── editor
│   │   ├── ckeditor.js
│   │   └── editorStyle.css
│   ├── editorImg
│   ├── img
│   ├── js
│   │   ├── boardDetail.js
│   │   ├── edit.js
│   │   ├── index.js
│   │   ├── listMain.js
│   │   ├── main.js
│   │   ├── post.js
│   │   ├── profile.js
│   │   └── questionDetail.js
│   ├── profileImg
│   └── svg
└── views
    ├── 404.ejs
    ├── community
    │   ├── boardDetail.ejs
    │   ├── edit.ejs
    │   ├── listMain.ejs
    │   ├── post.ejs
    │   └── questionDetail.ejs
    ├── components
    │   ├── carousel.ejs
    │   ├── cdn.ejs
    │   ├── footer.ejs
    │   ├── freeBoardCard.ejs
    │   ├── header.ejs
    │   └── questionBoardCard.ejs
    ├── main.ejs
    ├── styles
    │   ├── boardDetail.css
    │   ├── editProfile.css
    │   ├── email.css
    │   ├── findId.css
    │   ├── findPw.css
    │   ├── globalstyle.css
    │   ├── index.css
    │   ├── listMain.css
    │   ├── login.css
    │   ├── post.css
    │   ├── profile.css
    │   └── register.css
    └── user
        ├── editprofile.ejs
        ├── email.ejs
        ├── findId.ejs
        ├── findPw.ejs
        ├── join.ejs
        ├── login.ejs
        └── profile.ejs

```
