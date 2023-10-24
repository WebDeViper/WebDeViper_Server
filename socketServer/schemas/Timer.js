const mongoose = require('mongoose');
const { Schema } = mongoose;

const timerSchema = new Schema({
  _id: {
    nickname: { type: String, required: true, unique: true },
    daily: {
      date: { type: Date },
      subjects: [
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

module.exports = mongoose.model('timer', timerSchema);
