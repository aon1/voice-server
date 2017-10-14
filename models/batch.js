'use strict';
module.exports = function (sequelize, DataTypes) {
  var Batch = sequelize.define('Batch', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      field: 'name',
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',
      allowNull: false
    },
    noOfRecords: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      field: 'status',
      defaultValue: 'PENDING',
      allowNull: false
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    surveyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
      tableName: 'batches',
      freezeTableName: true,
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return Batch;
};