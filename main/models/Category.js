const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Category model for grouping items (e.g., Electronics, Documents, Pets).
 */
const Category = sequelize.define(
  'Category',
  {
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CategoryName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'ItemCategories',
    timestamps: false,
  }
);

module.exports = Category;
