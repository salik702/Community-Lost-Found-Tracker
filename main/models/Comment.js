const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Comment model for community interaction on reported items.
 */
const Comment = sequelize.define(
  'Comment',
  {
    CommentID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ItemID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CommentText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    CommentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Comments',
    timestamps: false,
  }
);

module.exports = Comment;
