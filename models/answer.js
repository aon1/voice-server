'use strict';
module.exports = function (sequelize, DataTypes) {
  var Answer = sequelize.define('Answer', {
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    contactId: DataTypes.INTEGER,
    batchId: DataTypes.INTEGER,
    dtmf: DataTypes.STRING,
    mediaFile: DataTypes.STRING
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  Answer.findBySurveyIdBatchId = function (surveyId, batchId) {
    return new Promise(function (resolve, reject) {
      sequelize.query('select a.*, c.phoneNumber from answers a join contacts c on a.contactId = c.id join questions q on q.id = a.questionId where q.surveyId = :surveyId and a.batchId = :batchId',
        { replacements: { surveyId: surveyId, batchId: batchId }, type: sequelize.QueryTypes.SELECT }
      ).then(answers => {
        resolve(answers);
      }).catch(function (err) {
        reject(err);
      })
    });

  }
  return Answer;
};