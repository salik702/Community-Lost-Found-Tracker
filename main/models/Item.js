const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Item model representing lost, found, or stolen property.
 * This is the central entity for reports and community interactions.
 */
const Item = sequelize.define(
  'Item',
  {
    ItemID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ItemName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ConditionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PriorityID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    LocationFoundOrLost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM('Lost', 'Found', 'Stolen', 'Recovered'),
      allowNull: false,
      defaultValue: 'Lost',
    },
    DateReported: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ImageURL: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'Items',
    timestamps: false,
  }
);

module.exports = Item;
