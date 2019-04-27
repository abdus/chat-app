const mongoose = require('mongoose');
mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : 'mongodb://127.0.0.1/chat-app',
  { useNewUrlParser: true }
);

let chatroomSchema = new mongoose.Schema(
  {
    roomname: { type: String, required: true },
  },
  { autoIndex: false }
);

module.exports = mongoose.model('chatrooms', chatroomSchema);
