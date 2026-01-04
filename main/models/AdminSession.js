const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * AdminSession model for tracking active administrative login sessions.
 */
const AdminSession = sequelize.define(
  'AdminSession',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    session_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'admin_sessions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = AdminSession;
