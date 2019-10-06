'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'clusters',
      'generated_ids',
      Sequelize.INTEGER
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'clusters',
      'generated_ids',
      Sequelize.INTEGER
    );
  }
};
