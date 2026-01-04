const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * ItemPriority model for ranking the urgency of reported items.
 */
const ItemPriority = sequelize.define(
    'ItemPriority',
    {
        PriorityID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PriorityLevel: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'ItemPriorities',
        timestamps: false,
    }
);

module.exports = ItemPriority;
