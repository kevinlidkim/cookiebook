var Person = require('./models/person');

var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app) {

  app.get('/api/persons', function(req, res) {
    Person.findAll().then(function(persons) {
      res.json(persons);
    })
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};