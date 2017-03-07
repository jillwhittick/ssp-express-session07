var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;

  username = username.trim();

  if (username.length == 0) {
    res.redirect('/login');
  }
  else {
    req.session.username = username;
    res.redirect('/');
  }
});

router.get('/', function(req, res, next) {
  res.render('jokeList', {jokes: req.session.allJokes});
});

module.exports = router;
