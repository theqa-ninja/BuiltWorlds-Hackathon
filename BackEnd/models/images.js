'use strict';
module.exports = (sequelize, DataTypes) => {
  const images = sequelize.define('images', {
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    altitude: DataTypes.FLOAT,
    session_id: DataTypes.INTEGER,
    cluster_id: DataTypes.INTEGER,
    url: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    make: DataTypes.TEXT,
    model: DataTypes.TEXT,
    isDeleted: DataTypes.BOOLEAN,
    exif: DataTypes.JSON
  }, {});
  images.associate = function(models) {
    // associations can be defined here
  };
  return images;
};