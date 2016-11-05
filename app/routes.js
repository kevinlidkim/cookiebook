
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app) {

  var persons = require('./controllers/persons');
  app.get('/persons/find', persons.findAll);
  app.get('/persons/:id', persons.show);
  app.post('/persons/signup', persons.create);

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};