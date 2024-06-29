var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile');
});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact
  })

  userModel.register(data, req.body.password)
  .then(function(user){
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect("/profile");
    });
  })
  .catch(function(err) {
    res.render('register', { error: err.message });
  });
});

router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile"
}), function(req, res ,next){
});

router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{res.redirect("/");};
}

module.exports = router;
