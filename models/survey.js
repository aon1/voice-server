'use strict';
module.exports = function (sequelize, DataTypes) {
  var Survey = sequelize.define('Survey', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    statusMessage: DataTypes.STRING
  }, {
      tableName: 'surveys',
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return Survey;
};