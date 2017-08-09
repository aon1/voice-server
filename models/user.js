'use strict';
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      field: 'username',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
      underscored: true,
      tableName: 'users',
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          User.hasMany(models.Contact);
        }
      }
    });
  return User;
};