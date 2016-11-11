/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('OwnsGroup', {
    owner: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'userId'
      },
      field: 'owner'
    },
    group: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Group',
        key: 'groupId'
      },
      field: 'group'
    }
  }, 
  {
    timestamps: false,
    tableName: 'OwnsGroup'
  });
};
