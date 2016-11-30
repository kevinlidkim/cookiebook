
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app, passport) {

  var persons = require('./controllers/persons');
  var users = require('./controllers/users');
  var pages = require('./controllers/pages');
  var posts = require('./controllers/posts');
  var comments = require('./controllers/comments');
  var likes = require('./controllers/likes');
  
  app.get('/persons/find', persons.findAll); // lists all persons
  app.get('/yo', users.findAll); // lists all users
  app.get('/yopages', pages.findAll);
  app.get('/yoyopages', pages.findAll2);
  app.get('/yoposts', posts.findAll);
  app.get('/yoyoposts', posts.findAll2);
  app.get('/yocom', comments.findAll);
  app.get('/yolikesPost', likes.findAll);


  app.get('/logout', users.logout);
  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/signup',
    failureFlash: true
  }), users.create);
  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true
  }), users.login);
  app.get('/status', users.auth);


  app.post('/page', pages.loadPage);
  app.post('/post', posts.makePost);
  app.post('/comment', comments.makeComment);
  app.post('/likesPost', likes.LikesPost);
  app.post('/likesComment', likes.LikesComment);
  app.get('/page/me', pages.getPersonalPageId);

  app.post('/update', users.updateProfile);

  app.post('/query/all', users.queryAll);

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};