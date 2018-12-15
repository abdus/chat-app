const r = require('express').Router();
const msgSchema = require('../db/messageSchema');
const roomRoute = require('./rooms')

r.get('/', (req, res) => {
    res.redirect('/room/general')
})

r.get('/messages/:room', (req, res) => {
    msgSchema.find({chatRoom: req.params.room}).sort({time: 1})
    .then(data => res.json(data))
    .catch(err => res.json(err)); 
})

r.use('/room', roomRoute)

// exports 
module.exports = r;