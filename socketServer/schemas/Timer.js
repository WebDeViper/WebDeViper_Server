const mongoose = require('mongoose');
const { Schema } = mongoose;

const timerSchema = new Schema({
  _id: {
    group_id: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    daily: {
      date: { type: Date },
      data: [
        {
          title: { type: String },
          timer: { type: String },
        },
      ],
    },
  },
});

// "_id" 필드에 ObjectId를 명시적으로 추가
timerSchema.add({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
});

// const newTimerData = {
//   id: 'alsdud1240',
//   nickname: '몽구스',
//   daily: {
//     date: new Date('2023-10-23'),
//     subjects: [
//       {
//         title: '운영체제',
//         timer: '4:05:23',
//       },
//     ],
//   },
// };

// const newTimer = new Timer(newTimerData);

// newTimer
//   .save()
//   .then(() => {
//     console.log('새로운 timer 데이터가 MongoDB에 추가되었습니다.');
//   })
//   .catch(err => {
//     console.error('데이터 추가 중 오류 발생: ', err);
//   });
module.exports = mongoose.model('timer', timerSchema);
