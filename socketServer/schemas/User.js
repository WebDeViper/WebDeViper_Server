const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user: {
    user_id: { type: Number, required: true, unique: true },
    nick_name: {
      type: String,
    },
  },
});

module.exports = mongoose.model('User', userSchema);
// const User = mongoose.model('User', userSchema);
// module.exports = {
//   User,
// };
