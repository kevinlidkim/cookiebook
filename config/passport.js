var db = require('./db');

var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.userId);
  });

  passport.deserializeUser(function(id, done) {
    db.User.find({where: {userId: id}}).then(function(user) {
      if (!user) {
        console.log('Logged in user not in database');
        return done(null, false);
      }
      return done(null, user);
    }).catch(function(err) {
      return done(err, null);
    })
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    db.User.find({ where: { email: email }}).then(function(user) {
      if (!user) {
        return done(null, false, req.flash('signinMessage', 'Unknown user'));
      } 
      else if (user.hashedPassword != password) {
        return done(null, false, req.flash('signinMessage', 'Invalid password'));
      } 
      else {
        return done(null, user);
      }
    }).catch(function(err) {
      return done(err);
    });

  }));

  // passport.use('local-login', new LocalStrategy({
  //   usernameField : 'email',
  //   passwordField : 'password',
  //   passReqToCallback : true
  // },
  // function(req, email, password, done) {

  //   db.User.find({ where: { email: email }}).then(function(user) {

  //     if (!user) {
  //       return done(null, false, req.flash('signinMessage', 'Unknown user'));
  //     } 
  //     else if (!user.authenticate(password)) {
  //       return done(null, false, req.flash('signinMessage', 'Invalid password'));
  //     } 
  //     else {
  //       return done(null, user);
  //     }

  //   });

  // }));
};