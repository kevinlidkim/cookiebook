
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app, passport) {

  var persons = require('./controllers/persons');
  var users = require('./controllers/users');
  
  app.get('/persons/find', persons.findAll); // lists all persons
  app.get('/yo', users.findAll); // lists all users


  app.get('/logout', users.logout);
  // app.post('/signup', users.create);

  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/signuup',
    failureFlash: true
  }), users.create);

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true
  }), users.login);

  app.get('/profile', isLoggedIn, users.profile);


  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      res.redirect('/');
    }
  }

};