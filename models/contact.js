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
      field: 'user_id',
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      validate: {
        notEmpty: true
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
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
      field: 'batch_id',
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
      underscored: true,
      tableName: 'contacts',
      freezeTableName: true
    });
  return Contact;
};