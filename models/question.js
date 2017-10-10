'use strict';
module.exports = function (sequelize, DataTypes) {
  var Question = sequelize.define('Question', {
    questionText: DataTypes.STRING,
    mediaFile: DataTypes.STRING,
    surveyId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    order: DataTypes.INTEGER
  }, {
      tableName: 'questions',
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return Question;
};