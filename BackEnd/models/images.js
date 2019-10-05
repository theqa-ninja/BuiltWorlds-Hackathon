'use strict';
module.exports = (sequelize, DataTypes) => {
  const images = sequelize.define('images', {
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    altitude: DataTypes.FLOAT,
    session_id: DataTypes.STRING,
    url: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    exif: DataTypes.JSON
  }, {});
  images.associate = function(models) {
    // associations can be defined here
  };
  return images;
};