module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FriendsRequest', {
    user: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'userId'
      },
      field: 'user'
    },
    friend: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'userId'
      },
      field: 'friend'
    }
  }, 
  {
    timestamps: false,
    tableName: 'FriendsRequest'
  });
};
