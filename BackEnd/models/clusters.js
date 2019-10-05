'use strict';
module.exports = (sequelize, DataTypes) => {
  const clusters = sequelize.define('clusters', {
    session_id: DataTypes.STRING
  }, {});
  clusters.associate = function(models) {
    // associations can be defined here
  };
  return clusters;
};