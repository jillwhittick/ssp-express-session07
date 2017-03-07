var express = require('express');
var router = express.Router();

var getJokeIndex = function(allJokes, jokeID) {
  var jokeIndex = -1;

  for (var i=0; i < allJokes.length; i++) {
      console.log("Checking " + allJokes[i].id + " against " + jokeID);
      if (allJokes[i].id == jokeID) {
        jokeIndex = i;
      }
  }

  return jokeIndex;
};

router.get('/createJoke', function(req, res, next) {
  res.render('jokeForm');
});

router.post('/newJoke', function(req, res, next) {
    var joke = {};
    joke.id = req.session.jokeCounter++;
    joke.date = new Date();
    console.log("Just created a joke on " + joke.date.toLocaleDateString());
    joke.joke = req.body.theJoke;

    req.session.allJokes.push(joke);

    res.redirect('/');
});

router.get('/delete/:id', function(req, res, next) {
  console.log("Deleting joke " + req.params.id);

  
  // /delete/
  if (req.params.id) {
    var jokeIndex = getJokeIndex(req.session.allJokes, req.params.id);

    if (jokeIndex != -1) {
      req.session.allJokes.splice(jokeIndex, 1);
    }
  }

  res.redirect('/');
});

router.get('/edit', function(req, res, next) {
  console.log("Editing joke " + req.query.id);

  if (req.query.id) {
    var jokeIndex = getJokeIndex(req.session.allJokes, req.query.id);

    if (jokeIndex != -1) {
      res.render('jokeForm', {joke: req.session.allJokes[jokeIndex]});
    } else {
      res.redirect('/');
    }
  }

});

router.post('/editJoke', function(req, res, next) {
  var jokeID = req.body.id;

  var jokeIndex = getJokeIndex(req.session.allJokes, req.body.id);

  if (jokeIndex != -1) {
    req.session.allJokes[jokeIndex].joke = req.body.theJoke;
  }

  res.redirect('/');
});

module.exports = router;
