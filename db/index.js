const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const messageSchema = require('./messageSchema');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : 'mongodb://127.0.0.1/chat-app',
  { useNewUrlParser: true, useUnifiedTopology: true}
);

module.exports = {
  userSchema,
  messageSchema,
};
