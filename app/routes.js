
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app, passport) {

  var persons = require('./controllers/persons');
  var users = require('./controllers/users');
  var pages = require('./controllers/pages');
  var posts = require('./controllers/posts');
  var comments = require('./controllers/comments');
  var groups = require('./controllers/groups');
  var likes = require('./controllers/likes');
  var employees = require('./controllers/employees');
  var managers = require('./controllers/managers');

  app.get('/persons/find', persons.findAll); // lists all persons
  app.get('/yo', users.findAll); // lists all users
  app.get('/yopages', pages.findAll);
  app.get('/relpages', pages.findAll2);
  app.get('/yoposts', posts.findAll);
  app.get('/yoyoposts', posts.findAll2);
  app.get('/yocom', comments.findAll);
  app.get('/yofr', persons.findAll2);
  app.get('/yofw', persons.findAll3);
  app.get('/yogroup', persons.findAll4);
  app.get('/yogroupreq', persons.findgroupreq);
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
  app.post('/updatePost', posts.updatePost);
  app.post('/deletePost', posts.deletePost);
  app.post('/comment', comments.makeComment);
  app.post('/updateComment', comments.updateComment);
  app.post('/deleteComment', comments.deleteComment);
  app.post('/commentedBy', comments.commentedBy);
  app.post('/likesPost', likes.LikesPost);
  app.post('/likesComment', likes.LikesComment);
  app.get('/page/me', pages.getPersonalPageId);

  app.post('/update', users.updateProfile);
  app.post('/addBankAccount', users.addBankAccount);
  app.post('/loadBankAccounts', users.loadBankAccounts);
  app.post('/deleteBankAccount', users.deleteBankAccount);
  app.post('/purchaseItem', users.purchaseItem);

  app.post('/query/all', users.queryAll);

  app.post('/page/friend', pages.getFriendPageId);
  app.post('/friend/request', users.sendFriendRequest);
  app.post('/friend/get', users.getFriendData);
  app.post('/friend/accept', users.acceptFriendRequest);

  app.post('/group/create', groups.createGroup);
  app.post('/group/update', groups.updateGroup);
  app.post('/group/delete', groups.deleteGroup);
  app.post('/groups/get', groups.getGroupData);
  app.post('/page/group', pages.getGroupPageId);
  app.post('/group/joinRequest', groups.joinGroupRequest);
  app.post('/group/sendRequest', groups.sendGroupRequest);
  app.post('/group/approveRequest', groups.approveGroupRequest);
  app.post('/group/approveSendGroupRequest', groups.approveSendGroupRequest);
  app.post('/page/groupRequests', groups.loadGroupRequest);
  app.post('/group/leave', groups.leaveGroup);
  app.post('/group/loadMembers', groups.loadGroupMembers);
  app.post('/group/remove', groups.removeGroupMember);

  app.post('/sendMessage', users.sendMessage);
  app.post('/loadMessages', users.loadMessages);
  app.post('/deleteMessage', users.deleteMessage);

  app.post('/isEmployee', users.isEmployee);
  app.post('/createAd', employees.createAd);
  app.post('/loadEmployeeAds', employees.loadEmployeeAds);
  app.post('/deleteEmployeeAd', employees.deleteEmployeeAd);
  app.post('/getCustomerMailingList', employees.getCustomerMailingList);

  app.post('/loadAds', pages.loadAds);

  app.post('/isManager', users.isManager);
  app.get('/loadAllAds', managers.loadAllAds);
  app.post('/loadMonthlyReport', managers.loadMonthlyReport);
  app.post('/salesSearchUser', managers.salesSearchUser);
  app.post('/salesSearchItem', managers.salesSearchItem);
  app.post('/companySearch', managers.companySearch);
  app.get('/getRichestUser', managers.getRichestUser);

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
