
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app, passport) {

  var persons = require('./controllers/persons');
  var users = require('./controllers/users');
  var pages = require('./controllers/pages');
  var posts = require('./controllers/posts');
  var comments = require('./controllers/comments');
<<<<<<< HEAD
  var groups = require('./controllers/groups');
=======
  var likes = require('./controllers/likes');
>>>>>>> 504a8f2f6cda64c09d11645d0f169f65ff11ed0c
  
  app.get('/persons/find', persons.findAll); // lists all persons
  app.get('/yo', users.findAll); // lists all users
  app.get('/yopages', pages.findAll);
  app.get('/relpages', pages.findAll2);
  app.get('/yoposts', posts.findAll);
  app.get('/yoyoposts', posts.findAll2);
  app.get('/yocom', comments.findAll);
<<<<<<< HEAD
  app.get('/yofr', persons.findAll2);
  app.get('/yofw', persons.findAll3);
<<<<<<< HEAD
  app.get('/yogroup', persons.findAll4);
  app.get('/yogroupreq', persons.findgroupreq);
=======
=======
  app.get('/yolikesPost', likes.findAll);
>>>>>>> cd9eddf5f87f3d539ce4a0c1efa4a12a93f9b782

>>>>>>> 504a8f2f6cda64c09d11645d0f169f65ff11ed0c

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

  app.post('/group/create', groups.createGroup);
  app.post('/groups/get', groups.getGroupData);
  app.post('/page/group', pages.getGroupPageId);
  app.post('/group/joinRequest', groups.joinGroupRequest);
  app.post('/group/approveRequest', groups.approveGroupRequest);
  app.post('/page/groupRequests', groups.loadGroupRequest);

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};