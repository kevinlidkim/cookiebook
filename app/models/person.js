var sequelize = require('sequelize');

var Person = sequelize.define('Person', {
  timestamps: false,
  tableName: 'Person'
})

module.exports = Person;