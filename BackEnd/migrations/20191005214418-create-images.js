'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      filename: {
        allowNull: false,
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      altitude: {
        type: Sequelize.FLOAT
      },
      session_id: {
        type: Sequelize.INTEGER
      },
      cluster_id: {
        type: Sequelize.INTEGER
      },
      isDeleted: {
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      url: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      make: {
        type: Sequelize.TEXT
      },
      model: {
        type: Sequelize.TEXT
      },
      exif: {
        type: Sequelize.JSON
      },
      created_at: {
        type: Sequelize.DATE
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('images');
  }
};
