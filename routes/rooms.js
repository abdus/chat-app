const r = require('express').Router();
const { isLoggedIn } = require('../controller/auth.controller');

r.get('/:roomname', (req, res) => {
  if (req.auth.code === 100) res.render('chat');
  else res.redirect('/');
});

module.exports = r;
