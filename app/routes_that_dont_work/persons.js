
var db = require('../../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app) {
  
  var persons = require('../controllers/persons');

  app.get('/api/abc', persons.findAll);

  app.get('/persons/:id', persons.show);

  app.post('/persons/signup', persons.create);

  // app.param('personId', persons.person);

};

// THIS DOESNT WORK BECAUSE I DONT hAVE THIS ROUTE SET UP IN MY SERVER.JS FILE
