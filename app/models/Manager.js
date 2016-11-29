/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Manager', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'userId'
      },
      field: 'userId'
    }
  },
  {
    timestamps: false,
    tableName: 'Manager'
  });
};