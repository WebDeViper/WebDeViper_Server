const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    room: String,
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamp: true }
);
module.exports = mongoose.model('Room', roomSchema);
