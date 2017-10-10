'use strict';
module.exports = function (sequelize, DataTypes) {
  var CallDetail = sequelize.define('CallDetail', {
    contactId: DataTypes.INTEGER,
    timeStarted: DataTypes.DATE,
    timeEnded: DataTypes.DATE,
    dtmf: DataTypes.STRING
  }, {
      tableName: 'call_details',
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });

  CallDetail.findByBatch = function (batchId) {
    return new Promise(function (resolve, reject) {
      sequelize.query('select cd.*, c.* from contacts c left join call_details cd on c.id = cd.contactId  WHERE c.batch_id = :batchId',
        { replacements: { batchId: batchId }, type: sequelize.QueryTypes.SELECT }
      ).then(calldetails => {
        resolve(calldetails);
      }).catch(function (err) {
        console.log(err);
        reject(err);
      })
    });

  }
  return CallDetail;
};