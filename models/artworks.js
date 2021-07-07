'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Artworks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Artworks.init({
    author: DataTypes.STRING,
    name: DataTypes.STRING,
    linenumber: DataTypes.INTEGER,
    pixelnumber: DataTypes.INTEGER,
    pixels: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Artworks',
    tableName: 'artworks',
  });
  return Artworks;
};