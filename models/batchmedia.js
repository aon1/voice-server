'use strict';
module.exports = function (sequelize, DataTypes) {
  var BatchMedia = sequelize.define('BatchMedia', {
    batchId: {
      references: {
        model: 'batches',
        key: 'id'
      },
      field: 'batch_id',
      type: DataTypes.INTEGER,
      allowNull: false
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
      underscored: true,
      tableName: 'batch_media',
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return BatchMedia;
};