'use strict';
module.exports = function (sequelize, DataTypes) {
  var Contact = sequelize.define('Contact', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    batchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'batches',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    status: {
      type: DataTypes.STRING,
      field: 'status',
      defaultValue: 'PENDING',
      allowNull: false
    }
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          Contact.belongsTo(model.User);
        }
      },
      tableName: 'contacts',
      freezeTableName: true
    });
  return Contact;
};