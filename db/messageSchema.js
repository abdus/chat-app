const mongoose = require('mongoose');
mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : 'mongodb://127.0.0.1/chat-app',
  { useNewUrlParser: true }
);

let messageSchema = new mongoose.Schema(
  {
    chatRoom: { type: String, required: true },
    user_id: { type: String },
    messageType: { type: String },
    name: { type: String },
    message: { type: String },
    imgSrc: { type: String },
    time: { type: Number },
    avatar: { type: String },
  },
  { autoIndex: false }
);

module.exports = mongoose.model('UserMessages', messageSchema);
