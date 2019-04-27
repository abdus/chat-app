const express = require('express');
const socket = require('socket.io');
const exphbs = require('express-handlebars');
const routes = require('./routes/routes');
const msgSchema = require('./db/messageSchema');

// app setup
const app = express();
const server = app.listen(3000, () => console.log('Listening on 3000'));

// view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

// middleware
app.use(express.static('static'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(routes);

// socket.io setup
let io = socket(server);
let totalConnectedClient = {};

io.on('connection', socket => {
  let roomName = socket.handshake.query.roomname;
  socket.join(roomName);

  totalConnectedClient[roomName] = totalConnectedClient[roomName]
    ? totalConnectedClient[roomName] + 1
    : 1;

  // on socket disconnection
  socket.on('disconnect', socket => {
    totalConnectedClient[roomName] = totalConnectedClient[roomName]
      ? totalConnectedClient[roomName] - 1
      : 1;
  });

  // emit a new chat message
  socket.on('chat', data => {
    io.to(roomName).emit('chat', data);
    data = new msgSchema({
      chatRoom: data.chatRoom,
      user_id: data._id,
      messageType: data.type,
      name: data.name,
      message: data.message,
      imgSrc: data.imgSrc,
      time: data.time,
      avatar: data.avatar,
    });
    data.save();
  });

  // typing... status
  socket.on('typing', data => {
    data.onlineCount = totalConnectedClient;
    socket.broadcast.to(roomName).emit('typing', data);
  });

  // for sending onlineCount every second
  setInterval(e => {
    io.to(roomName).emit('onlineCount', {
      count: totalConnectedClient[roomName],
    });
  }, 1000);
});
