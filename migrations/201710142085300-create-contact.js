'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      batchId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'batches',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('contacts');
  }
};