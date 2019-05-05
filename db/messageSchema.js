const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
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
