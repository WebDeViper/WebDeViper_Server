# 열줌쉬어

### 학습자를 위한 웹 서비스로 스탑워치/타이머 기능을 통해 실시간으로 공부시간을 기록하고, 가입한 그룹 내에 공부량을 시각화하여 보여주는 웹사이트 구현 프로젝트 (10/19 - 11/10)

## 팀 소개
|팀원명💁‍♂️|역할(파일명 기준)|
|:--:|:--|
[김태훈](https://github.com/hoonsdev)| Front) ChatPage, CreateGroupPage, DetailGroupPage, MainPage, NoticePage, StudyPage, 와이어프레임설계, 발표|
|[문석민](https://github.com/msm0748)| Front) AlarmPage, CreateNoticePage, DetailNoticePage, RankingPage, SignupPage, 와이어프레임설계 |
|[김세은](https://github.com/seeun0210)| Back) CategoryRank(카테고리별/개인별 랭크 기능), Notice(공지사항 CRUD), Notification(알림 기능), Timer(타이머 기능), Todo(todo CRUD), models, schemas, DB설계, ppt, 발표|
|[김태균](https://github.com/hotdog7778)| Back) Auth(토큰 기반 인증 기능), User(소셜 로그인 기능), models, schemas, 배포, DB설계, ppt, 발표 |
|[홍민영](https://github.com/HongMinYeong)| Back) Chat(그룹별 채팅 기능), Group(Group 관련 CRUD), models, schemas, DB설계, ppt     |

### 팀원별 역할
사진으로 넣을 예정 

## DEMO 💻
* [열줌쉬어 페이지 바로가기](https://team-c.store/)

|메인페이지|
|:--:|
|* 웹 사이트 소개글 </br>* 회원정보 수정 기능</br>* (공지사항 등록시/ 그룹요청시/ 유저가 요청한 그룹 수락/거절시/ 내가 속한 그룹이 삭제되었을 시) 알람 기능 </br>* 로그인 / 회원가입 기능</br>|

|공부하기 페이지|
|:--:|
|* (비로그인시) 모든 스터디 그룹 조회 '더보기'로 구현 </br>* (로그인시) 내가 속한 그룹 조회 </br>* 그룹 상세 정보 확인</br> * 그룹 생성 기능</br> * (내가 만든 그룹이 아닐 경우) 그룹 신청 기능 </br> * (그룹의 멤버일 때 && 그룹장이 아닐 때) 그룹 탈퇴 기능 </br>* (그룹의 멤버일 때 && 그룹장이 일때) 그룹 삭제 기능 </br>* (그룹의 멤버일 때) 채팅 기능 </br>|

|캘린더 페이지|
|:--:|
|* 날짜별 일정 추가 기능</br>|

|랭킹 페이지|
|:--:|
|* (카테고리별) 타이머'total time'순 개인유저 랭킹 </br>* (카테고리별) 타이머'total time'순 그룹 랭킹</br>|

|공지사항 페이지|
|:--:|
|* (관리자유저일 때) 공지사항 글 생성 기능 </br>* (관리자유저일 때) 공지사항 글 수정 기능</br>* (관리자유저일 때) 공지사항 글 삭제 기능</br>* 공지사항 글 조회 기능|
