const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * User model representing individuals in the Community Tracker system.
 * Handles both regular users and administrative staff.
 */
const User = sequelize.define(
  'User',
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Contact: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    RoleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: 'Users',
    timestamps: false,
  }
);

module.exports = User;
