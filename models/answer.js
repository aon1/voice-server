'use strict';
module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    dtmf: DataTypes.STRING,
    mediaFile: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Answer;
};