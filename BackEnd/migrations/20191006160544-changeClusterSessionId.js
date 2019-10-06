'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'clusters',
      'session_id',
      {
        type: 'INTEGER USING CAST("session_id" as INTEGER)'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'clusters',
      'session_id',
      Sequelize.STRING
    );
  }
};
