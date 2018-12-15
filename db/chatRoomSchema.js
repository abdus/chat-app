const mongoose = require('mongoose');
mongoose.connect('mongodb://thisisabdus:abcd12345@ds151453.mlab.com:51453/chat-app', { useNewUrlParser: true });

let chatroomSchema = new mongoose.Schema({
    roomname: {type: String, required: true}
}, { autoIndex: false })

module.exports = mongoose.model('chatrooms', chatroomSchema);