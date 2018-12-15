const mongoose = require('mongoose');
mongoose.connect('mongodb://thisisabdus:abcd12345@ds151453.mlab.com:51453/chat-app', { useNewUrlParser: true });

let messageSchema = new mongoose.Schema({
    chatRoom: { type: String, required: true },
    user_id: { type: String },
    messageType: { type: String },
    name: { type: String },
    message: { type: String },
    imgSrc: { type: String },
    time: { type: Number },
    avatar: { type: String }
}, { autoIndex: false })

module.exports = mongoose.model('UserMessages', messageSchema);