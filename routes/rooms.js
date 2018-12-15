const r = require('express').Router();

r.get('/', (req, res) => {
    res.redirect('/')
})

r.get('/:roomname', (req, res) => {
    return res.render('index');
})

module.exports = r;