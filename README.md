# 열줌쉬어

### 학습자를 위한 웹 서비스로 스탑워치/타이머 기능을 통해 실시간으로 공부시간을 기록하고, 가입한 그룹 내에 공부량을 시각화하여 보여주는 웹사이트 구현 프로젝트 (10/19 - 11/10)

&nbsp;
## 시작 가이드

### Requirements

- [Node.js 20.7.0](https://www.npmjs.com/package/node/v/20.7.0)
- [Npm 10.2.0](https://www.npmjs.com/package/npm/v/10.2.0)

### Installation

#### Front-End

```bash
$ git clone https://github.com/WebDeViper/WebDeViper_Client.git
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

## 팀 소개

### 🧑‍🤝‍🧑 팀 구성

| 프론트 개발                                                                | 프론트 개발                                                                | 백엔드 개발                                                                | 백엔드 개발                                                                | 백엔드 개발                                                                |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| <img src="./readme/img/gi.jpeg" width="100px" height="100px" alt="문석민"> | <img src="./readme/img/ku.jpeg" width="100px" height="100px" alt="김태훈"> | <img src="./readme/img/ke.jpeg" width="100px" height="100px" alt="홍민영"> | <img src="./readme/img/do.jpeg" width="100px" height="100px" alt="김세은"> | <img src="./readme/img/ta.jpeg" width="100px" height="100px" alt="김태균"> |
| [@seokmin](https://github.com/msm0748)                                     | [@taehoon](https://github.com/hoonsdev)                                    | [@minyeong](https://github.com/HongMinYeong)                               | [@seeun](https://github.com/seeun0210)                                     | [@taegyun](https://github.com/hotdog7778)                                  |
| 문석민                                                                     | 김태훈                                                                     | 홍민영                                                                     | 김세은                                                                     | 김태균                                                                     |

&nbsp;
|팀원명 💁‍♂️💁‍♂️|역할(파일명 기준)|
|:--:|:--|
[김태훈 ](https://github.com/hoonsdev)| Front) ChatPage, CreateGroupPage, DetailGroupPage, MainPage, NoticePage, StudyPage, 와이어프레임설계, 발표|
|[문석민 ](https://github.com/msm0748)| Front) AlarmPage, CreateNoticePage, DetailNoticePage, RankingPage, SignupPage, 와이어프레임설계 |
|[김세은 ](https://github.com/seeun0210)| Back) CategoryRank(카테고리별/개인별 랭크 기능), Notice(공지사항 CRUD), Notification(알림 기능), Timer(타이머 기능), Todo(todo CRUD), models, schemas, DB설계, ppt, 발표|
|[김태균 ](https://github.com/hotdog7778)| Back) Auth(토큰 기반 인증 기능), User(소셜 로그인 기능), models, schemas, 배포, DB설계, ppt, 발표 |
|[홍민영 ](https://github.com/HongMinYeong)| Back) Chat(그룹별 채팅 기능), Group(Group 관련 CRUD), models, schemas, DB설계, ppt |


### 팀원별 역할
&nbsp;
사진으로 넣을 예정

&nbsp;
### ⚙️ 개발 환경
&nbsp;
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

## ERD

&nbsp;
<img src="./readme/img/ERD.jpeg" width="600px" height="600px">
&nbsp;
## 와이어 프레임

&nbsp;
<img src="./readme/img/와이어프레임.jpeg" width="600px" height="600px">

&nbsp;



## 디렉토리 구조
&nbsp;
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
&nbsp;
## DEMO 💻
&nbsp;
- [열줌쉬어 페이지 바로가기](https://team-c.store/)

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

&nbsp;

|                                                                                          메인페이지                                                                                           |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| \* 웹 사이트 소개글 </br>\* 회원정보 수정 기능</br>\* (공지사항 등록시/ 그룹요청시/ 유저가 요청한 그룹 수락/거절시/ 내가 속한 그룹이 삭제되었을 시) 알람 기능 </br>\* 로그인 / 회원가입 기능</br> |

|                                                                                                                                                                         공부하기 페이지                                                                                                                                                                          |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| \* (비로그인시) 모든 스터디 그룹 조회 '더보기'로 구현 </br>\* (로그인시) 내가 속한 그룹 조회 </br>\* 그룹 상세 정보 확인</br> \* 그룹 생성 기능</br> \* (내가 만든 그룹이 아닐 경우) 그룹 신청 기능 </br> \* (그룹의 멤버일 때 && 그룹장이 아닐 때) 그룹 탈퇴 기능 </br>\* (그룹의 멤버일 때 && 그룹장이 일때) 그룹 삭제 기능 </br>\* (그룹의 멤버일 때) 채팅 기능 </br> |

|         캘린더 페이지         |
| :---------------------------: |
| \* 날짜별 일정 추가 기능</br> |

|                                                랭킹 페이지                                                |
| :-------------------------------------------------------------------------------------------------------: |
| \* (카테고리별) 타이머'total time'순 개인유저 랭킹 </br>\* (카테고리별) 타이머'total time'순 그룹 랭킹</br> |

|                                                                          공지사항 페이지                                                                           |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| \* (관리자유저일 때) 공지사항 글 생성 기능 </br>\* (관리자유저일 때) 공지사항 글 수정 기능</br>\* (관리자유저일 때) 공지사항 글 삭제 기능</br>\* 공지사항 글 조회 기능 |
