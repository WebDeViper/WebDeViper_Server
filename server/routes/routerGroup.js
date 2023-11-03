const express = require('express');
const router = express.Router();
// const controller = require('../controller/ctrGroup');
const test = require('../controller/ctrGroupMongoose');
const { verifyJwtToken } = require('../middlewares/jwt/jwt');
const multer = require('multer');
const { groupImgUploader } = require('../middlewares/multer/multerConfig'); // 그룹이미지 업로드임

// //현재 로그인한 유저의 카테고리내에서 그룹조회
// router.get('/studyGroups', verifyJwtToken, controller.getCategoryGroups);
// // 현재 로그인한 유저가 속한 스터디 그룹을 조회
// router.get('/studyGroups/users', verifyJwtToken, controller.getCategoryGroupsByUser);
// //그룹 요청 기능
// router.post('/studyGroup/:groupId/join', verifyJwtToken, controller.joinGroupRequest);
//그룹 생성 기능
// router.post(
//   '/studyGroup',
//   verifyJwtToken,
//   groupImgUploader.single('groupImgFile'),
//   (req, res, next) => {
//     const err = req.fileValidationError; // Multer가 발생한 오류를 req.fileValidationError에 저장
//     if (err instanceof multer.MulterError) {
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).send({ msg: '파일 크기가 너무 큽니다. (최대 5MB)' });
//       } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
//         return res.status(400).send({ msg: '예상치 못한 파일이 업로드되었습니다.' });
//       } else {
//         return res.status(400).send({ msg: '파일 업로드에 실패했습니다.' });
//       }
//     } else if (err) {
//       return res.status(400).send({ error: err.message });
//     } else {
//       next(); // 오류가 없음. 컨트롤러로 전달
//     }
//   },
//   controller.postGroupInformation
// );
// router.post('/studyGroup', verifyJwtToken, controller.postGroupInformation);
// //그룹 옵션 수정 기능
// router.patch('/studyGroup/:groupId', verifyJwtToken, controller.patchGroupInformation);
// //그룹 삭제 기능
// router.delete('/studyGroup/:groupId', verifyJwtToken, controller.deleteGroup);

//////////mongoose 버전 테스트
//현재 로그인한 유저의 카테고리내에서 그룹조회
router.get('/studyGroups/test', test.getCategoryGroups);
// 현재 로그인한 유저가 속한 스터디 그룹을 조회
router.get('/studyGroups/users/test', test.getCategoryGroupsByUser);
//그룹 요청 기능
router.post('/studyGroup/:groupId/join/test', test.joinGroupRequest);
//그룹 요청 수락/거절 기능
// /api/groups/{group_id}/membership/requests/{request_id}/accept
// /api/groups/{group_id}/membership/requests/{request_id}/reject
router.post('/studyGroup/:groupId//membership/requests/{request_id}/accept/test', test.acceptGroupMembershipRequest);

//그룹 생성 기능
router.post('/studyGroup/test', test.postGroupInformation);
//그룹 옵션 수정 기능
router.patch('/studyGroup/:groupId/test', test.patchGroupInformation);
//그룹 탈퇴 기능
router.delete('/studyGroup/:groupId/test', test.deleteGroup);
//그룹장이 그룹을 삭제했을 때
router.delete('/studyGroup/:groupId/members/test', test.removeAllMembersFromGroup);

module.exports = router;
