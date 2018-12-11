const express = require('express');
const socket = require('socket.io');
const exphbs  = require('express-handlebars');
const routes = require('./routes/routes')

// app setup
const app = express();
const server = app.listen(3000, () => console.log('Listening on 3000'))

// view engine 
app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');

// middleware 
app.use(express.static('static'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false, limit: '50mb'}));
app.use(routes);

// socket.io setup
let io = socket(server);
let totalConnectedClient = 0;

io.on('connection', socket => {
    totalConnectedClient += 1;

    // on socket disconnection
    socket.on('disconnect', socket => {
        totalConnectedClient -= 1;
    })
    
    // emit a new chat message
    socket.on('chat', data => {
        io.sockets.emit('chat', data);
    })

    // typing... status
    socket.on('typing', data => {
        data.onlineCount = totalConnectedClient;
        socket.broadcast.emit('typing', data);
    })

    // for sending onlineCount every second
    setInterval(e => {
        io.sockets.emit('onlineCount', {count: totalConnectedClient})
    }, 1000)
})