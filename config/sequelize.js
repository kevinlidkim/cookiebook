var Sequelize = require('sequelize');

var secret = require('./secret.json');


var sequelize = new Sequelize('cookiebook', 'root', 'f4b8SWtgSvd7swej@', {
  host: secret.host,
  port: secret.port,
  dialect: 'mysql',
  logging: false
})

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Sequelize connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

module.export = sequelize;