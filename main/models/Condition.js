const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Condition model for describing the state of an item (e.g., New, Used, Damaged).
 */
const Condition = sequelize.define(
  'Condition',
  {
    ConditionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ConditionName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'ItemConditions',
    timestamps: false,
  }
);

module.exports = Condition;
