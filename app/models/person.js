// var sequelize = require('sequelize');

// module.exports = function(sequelize, DataTypes) {

//   var Person = sequelize.define('Person',
//     {
//       personId: { type: DataTypes.INTEGER, primaryKey: true }
//     }
//   );

//   return Person;
// };

var db = require('../../config/db'),
    sequelize = db.sequelize;
    Sequelize = db.Sequelize;

var Person = sequelize.define('Person', 
  {
    personId: { type: Sequelize.INTEGER, primaryKey: true},
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = Person;