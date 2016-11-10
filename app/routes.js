
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app) {

  var persons = require('./controllers/persons');
  var users = require('./controllers/users');
  
  app.get('/persons/find', persons.findAll); // lists all persons
  app.get('/persons/:id', persons.show);
  app.post('/api/persons', persons.create);

  app.get('/yo', users.findAll); // lists all users
  app.post('/signup', users.create);

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};