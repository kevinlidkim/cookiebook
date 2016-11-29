var db = require('../../config/db');
var crypto = require('crypto');
var _ = require('lodash');

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

exports.findAll = function(req, res) {

  db.User.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.login = function(req, res) {

  req.logIn(req.user, function(err) {
    if (err) {
      return res.status(500).json({
        status: 'Could not log in user'
      });
    } else {

      db.Person.find({ where: {personId: req.user.personId} })
        .then(function(person) {

          var data = {
            personId: req.user.personId,
            userId: req.user.userId,
            adPreferences: req.user.adPreferences,
            firstName: person.firstName,
            lastName: person.lastName
          }

          return res.status(200).json({
            status: 'Login successful',
            user: data
          });

        });
    }
  })
}

exports.logout = function(req, res) {
  req.logout();
  return res.status(200).json({
    status: 'Bye!'
  });
}

exports.create = function(req, res) {

  var newPage = {
    postCount: 0
  }

  db.Page.create(newPage)
    .then(function(page) {

      var relation = {
        page: page.pageId,
        owner: req.user.userId
      };

      return db.OwnsPage.create(relation);
    })

  return res.status(200).json({
   status: 'Registration successful!'
  });
}

exports.auth = function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  } else {
    return res.status(200).json({
      status: true
    })
  }
}

exports.updateProfile = function(req, res) {

  var obj = {};

  if (req.body.personObj) {
    db.Person.update(req.body.personObj, {
      where: {
        personId: req.body.idObj.personId
      }
    })
      .then(function() {
        if (req.body.userObj) {
          if (req.body.userObj.password) {
            var salt = makeSalt();
            var hashedPassword = encryptPassword(req.body.userObj.password, salt);
            req.body.userObj.salt = salt;
            req.body.userObj.hashedPassword = hashedPassword;
          }
          db.User.update(req.body.userObj, {
            where: {
              userId: req.body.idObj.userId
            }
          })
            .then(function() {
              return db.Person.find({ where: {personId: req.body.idObj.personId} })
            })
            .then(function(person) {
              obj.personId = person.personId;
              obj.firstName = person.firstName;
              obj.lastName = person.lastName;
              return db.User.find({ where: {personId: person.personId} })
            })
            .then(function(user) {
              obj.adPreferences = user.adPreferences;
              obj.userId = user.userId;
              return res.status(200).json({
                data: obj,
                status: 'Update profile successful'
              })
            })
            .catch(function(err) {
              return res.status(500).json({
                status: 'Error updating profile'
              })
            })
        } else {
          db.Person.find({ where: {personId: req.body.idObj.personId} })
            .then(function(person) {
              obj.personId = person.personId;
              obj.firstName = person.firstName;
              obj.lastName = person.lastName;
              return db.User.find({ where: {personId: person.personId} })
            })
            .then(function(user) {
              obj.adPreferences = user.adPreferences;
              obj.userId = user.userId;
              return res.status(200).json({
                data: obj,
                status: 'Update person successful'
              })
            })
        }

      })
      .catch(function(err) {
        return res.status(200).json({
          status: 'Error updating person'
        })
      })
  } else if (req.body.userObj) {
    if (req.body.userObj.password) {
      var salt = makeSalt();
      var hashedPassword = encryptPassword(req.body.userObj.password, salt);
      req.body.userObj.salt = salt;
      req.body.userObj.hashedPassword = hashedPassword;
    }
    db.User.update(req.body.userObj, {
      where: {
        userId: req.body.idObj.userId
      }
    })
      .then(function() {
        return db.User.find({ where: {userId: req.body.idObj.userId} })
      })
      .then(function(user) {
        obj.adPreferences = user.adPreferences;
        obj.userId = user.userId;
        return db.Person.find({ where: {personId: user.personId} })
      })
      .then(function(person) {
        obj.firstName = person.firstName,
        obj.lastName = person.lastName,
        obj.personId = person.personId
      })
      .then(function() {
        return res.status(200).json({
          data: obj,
          status: 'Update user successful'
        })
      })
      .catch(function(err) {
        return res.status(500).json({
          status: 'Error updating user'
        })
      })
  }

}

exports.queryAll = function(req, res) {

  var array = [];
  var data = {};
  var arrayOfPersons;
  var users = [];
  
    db.Group.findAll({ where: Sequelize.or(
      ["groupName like ?", '%' + req.body.query + '%'],
      ["type like ?", '%' + req.body.query + '%']
      ) })
    .then(function(groups) {
      data.groups = groups;

      db.Person.findAll({ where: Sequelize.or(
        ["firstName like ?", '%' + req.body.query + '%'],
        ["lastName like ?", '%' + req.body.query + '%']
        ) })
      .then(function(persons) {
        arrayOfPersons = persons;

        _.forEach(persons, function(person) {
          array.push(db.User.find({ where: {personId: person.personId} }))
        })
        
        Promise.all(array).then(arrayOfUsers => {
          data.users = arrayOfUsers;

          var people = _.keyBy(arrayOfPersons, 'personId');

          _.forEach(arrayOfUsers, function(user) {
            var result = {
              email: user.email,
              userId: user.userId,
              personId: user.personId,
              firstName: people[user.personId].firstName,
              lastName: people[user.personId].lastName
            }
            users.push(result);
          })

          data.users = users;

        })
        .then(function() {
          return res.status(200).json({
            status: 'Frontpage query successful',
            data: data
          })
        })
        .catch(function(err) {
          console.log(err);
          return res.status(500).json({
            status: 'Error querying frontpage'
          })
        })

      })
      
    })

}

exports.sendFriendRequest = function(req, res) {

  db.FriendsWith.find({ where: {user: req.body.you, friend: req.body.friend} })
    .then(function(friendsWith) {

      if (friendsWith == null) {
        db.FriendsRequest.find({ where: {user: req.body.you, friend: req.body.friend} })
          .then(function(friendsRequest) {

            if (friendsRequest == null) {
              var newRequest = {
                user: req.body.you,
                friend: req.body.friend
              }
              db.FriendsRequest.create(newRequest)
                .then(function() {
                  return res.status(200).json({
                    status: 'Friend request sent'
                  })
                })
                .catch(function(err) {
                  return res.status(500).json({
                    status: 'Error sending friend request'
                  })
                })

            } else {
              return res.status(200).json({
                status: 'Friend request already sent'
              })
            }
          })


      } else {
        return res.status(200).json({
          status: 'Already friends'
        })
      }
    })

}

exports.getFriendData = function(req, res) {

  var data = {};
  var arrayOfFriends = [];
  var arrayOfFriendRequests = [];

  db.FriendsWith.findAll({ where: {user: req.body.you} })
    .then(function(friendsWith) {

      var promiseArrayFriends = [];
      _.forEach(friendsWith, function(getFriend) {
        promiseArrayFriends.push(db.User.find({ where: {userId: getFriend.friend} }))
      })

      Promise.all(promiseArrayFriends).then(values => {
        data.friends = values;

        var arrayOfPersons = [];
        _.forEach(values, function(getPerson) {
          arrayOfPersons.push(db.Person.find({ where: {personId: getPerson.personId} }))
        })

        var friendData = _.keyBy(data.friends, 'personId');

        Promise.all(arrayOfPersons).then(persons => {
          _.forEach(persons, function(person) {
            var result = {
              firstName: person.firstName,
              lastName: person.lastName,
              personId: person.personId,
              userId: friendData[person.personId].userId
            }
            arrayOfFriends.push(result);
          })
        })
        .then(function() {
          return db.FriendsRequest.findAll({ where: {friend: req.body.you} })
        })
        .then(function(friendsRequest) {

          var promiseArrayRequest = [];
          _.forEach(friendsRequest, function(getRequest) {
            promiseArrayRequest.push(db.User.find({ where: {userId: getRequest.user} }))
          })

          Promise.all(promiseArrayRequest).then(requests => {
            data.requests = requests;

            var arrayOfRequests = [];
            _.forEach(requests, function(request) {
              arrayOfRequests.push(db.Person.find({ where: {personId: request.personId} }))
            })

            var requestData = _.keyBy(data.requests, 'personId');

            Promise.all(arrayOfRequests).then(personRequests => {
              _.forEach(personRequests, function(personRequest) {
                var result = {
                  firstName: personRequest.firstName,
                  lastName: personRequest.lastName,
                  personId: personRequest.personId,
                  userId: requestData[personRequest.personId].userId
                }
                arrayOfFriendRequests.push(result);
              })
            })
            .then(function() {
              return res.status(200).json({
                status: 'Retrieve friends list',
                friends: arrayOfFriends,
                requests: arrayOfFriendRequests
              })
            })
            .catch(function(err) {
              console.log(err);
              return res.status(500).json({
                status: 'Failed to retrieve friends list'
              })
            })
          })

        })

      })

    })
}

exports.acceptFriendRequest = function(req, res) {
  
  var obj = {
    user: req.body.you,
    friend: req.body.friend
  }
  var friendObj = {
    user: req.body.friend,
    friend: req.body.you
  }

  db.FriendsWith.create(obj)
    .then(function() {
      return db.FriendsWith.create(friendObj);
    })
    .then(function() {
      return db.FriendsRequest.find({ where: {user: req.body.friend, friend: req.body.you } });
    })
    .then(function(request) {
      return request.destroy();
    })
    .then(function() {
      return res.status(200).json({
        status: 'Friend added'
      })
    })
    .catch(function(err) {
      return res.status(500).json({
        status: 'Error adding friend'
      })
    })

}