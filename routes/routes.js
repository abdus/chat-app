const r = require('express').Router();
const msgSchema = require('../db/messageSchema');

r.get('/', (req, res) => {
    res.render('index')
})

r.get('/messages', (req, res) => {
    msgSchema.find()
    .then(data => res.json(data))
    .catch(err => res.json(err)); 
})

// exports 
module.exports = r;