var db = require('../../config/db');

exports.findAll = function(req, res) {

  db.User.findAll()
    .then(function (users) {
      res.status(200).json(users);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.show = function(req, res) {

  db.User.findById(req.params.id)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
}

exports.login = function(req, res) {

  return res.send({status: 'success', message: 'User login successfully.'});
}

exports.logout = function(req, res) {
  req.logout();
  return res.send({status: 'success', message: 'User logout successfully.'});
}

exports.profile = function(req, res) {

  // console.log(req);
  // return res.send({status: 'success', message: 'LOGINGINGIGNIGNIGN.'});
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

  db.User.update(req.body, {
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

  db.User.destroy({
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