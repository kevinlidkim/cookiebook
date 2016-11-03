
var db = require('../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

module.exports = function(app) {

  // app.get('/api/oldpersons', function(req, res) {
  //   OldPerson.findAll().then(function(oldpersons) {
  //     res.json(oldpersons);
  //   })
  // });

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });

};