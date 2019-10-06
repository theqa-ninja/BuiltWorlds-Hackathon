'use strict';
module.exports = (sequelize, DataTypes) => {
  const clusters = sequelize.define('clusters', {
    session_id: DataTypes.INTEGER,
    generated_id: DataTypes.INTEGER
  }, {});
  clusters.associate = function(models) {
    // associations can be defined here
  };
  return clusters;
};