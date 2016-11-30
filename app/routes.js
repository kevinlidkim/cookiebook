
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
<<<<<<< HEAD
  app.get('/yofr', persons.findAll2);
  app.get('/yofw', persons.findAll3);
=======
  app.get('/yolikesPost', likes.findAll);
>>>>>>> cd9eddf5f87f3d539ce4a0c1efa4a12a93f9b782


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

  app.post('/page/friend', pages.getFriendPageId);
  app.post('/friend/request', users.sendFriendRequest);
  app.post('/friend/get', users.getFriendData);
  app.post('/friend/accept', users.acceptFriendRequest);
  // app.post('/page/friend', pages.getFriendPageId);

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};