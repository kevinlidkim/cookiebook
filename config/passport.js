var db = require('./db');
var crypto = require('crypto');

var LocalStrategy = require('passport-local').Strategy;

var makeSalt = function() {
  return crypto.randomBytes(16).toString('base64');
}

var encryptPassword = function(password, salt) {
  if (!password || !salt) {
    return '';
  }
  salt = new Buffer(salt, 'base64');
  return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
}

var authenticate = function(password, salt, hashedPassword) {
  return encryptPassword(password, salt) === hashedPassword;
}

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    return done(null, user.userId);
  });

  passport.deserializeUser(function(id, done) {
    db.User.find({ where: {userId: id} }).then(function(user) {
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
        return done(null, false, { message: 'Unknown user' });
      } 
      else if (!authenticate(password, user.salt, user.hashedPassword)) {
        return done(null, false, { message: 'Invalid password' });
      } 
      else {
        return done(null, user);
      }
    }).catch(function(err) {
      return done(err);
    });

  }));

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    db.User.find({ where: { email: email }}).then(function(user) {
      if (user) {
        return done(null, false, { message: 'Email already in use' });
      } 
      else {
        var person = db.Person.create(req.body)
          .then(function(newPerson) {
            var date = new Date();
            var salt = makeSalt();
            var hashedPassword = encryptPassword(req.body.password, salt);

            var userData = {
              email: req.body.email,
              accountCreateDate: date,
              personId: newPerson.personId,
              salt: salt,
              hashedPassword: hashedPassword
            };

            var newUser = db.User.create(userData);
            return newUser;
          })
          .then(function(returnUser) {
            return done(null, returnUser);
          })

        // return done(null, newUser);
      }
    }).catch(function(err) {
      return done(err);
    });

  }));

};