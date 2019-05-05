const express = require('express');
const socket = require('socket.io');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const { userSchema, messageSchema } = require('./db');
const { decodeToken } = require('./auth/jwt.auth');

// app setup
const app = express();
const server = app.listen(process.env.PORT || 3000, () =>
  console.log('Listening on 3000')
);

// view engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

// middleware
app.use((req, res, next) => {
  // req.port = server.address().port;
  next();
});
app.use(express.static('static'));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
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
    decodeToken(data.jwt)
      .then(async d => {
        console.log(d);
        const user = await userSchema.findById(d.id);
        console.log(decodeToken(data.jwt));
        data.name = user.name;

        io.to(roomName).emit('chat', data);
        data = new messageSchema({
          chatRoom: data.chatRoom,
          user_id: user._id,
          messageType: data.type,
          name: user.name,
          message: data.message,
          imgSrc: data.imgSrc,
          time: data.time,
          avatar: data.avatar,
        });
        data.save();
      })
      .catch(e => {
        console.log(e.message);
      });
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
