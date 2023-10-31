const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  nick_name: {
    type: String,
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('User', userSchema);
