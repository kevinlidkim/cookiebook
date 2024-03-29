var db = require('../../config/db');


exports.findAll = function(req, res) {

  db.Person.findAll()
    .then(function (persons) {
      res.status(200).json(persons);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.show = function(req, res) {

  db.Person.findById(req.params.id)
    .then(function (person) {
      res.status(200).json(person);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.create = function(req, res) {

  var person = db.Person.create(req.body)
    .then(function (newPerson) {

      var date = new Date();
      var userData = {
        email: req.body.email,
        hashedPassword: req.body.password,
        accountCreateDate: date,
        personId: newPerson.personId,
      };
      var user = db.User.create(userData)

      return user;
    })
    .then(function (newUser) {
      res.status(200).json(newUser);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.update = function(req, res) {

  db.Person.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(function (updatedRecords) {
      res.status(200).json(updatedRecords);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.delete = function(req, res) {

  db.Person.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(function (deletedRecords) {
      res.status(200).json(deletedRecords);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.findAll3 = function(req, res) {

  db.FriendsWith.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.findAll2 = function(req, res) {

  db.FriendsRequest.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.findAll4 = function(req, res) {

  db.Group.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.findgroupreq = function(req, res) {

  db.JoinGroupRequest.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}