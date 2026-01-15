const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Report model for logging official report entries for specific items.
 */
const Report = sequelize.define(
    'Report',
    {
        ReportID: {
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
        ReportType: {
            type: DataTypes.ENUM('Lost', 'Found', 'Stolen'),
            allowNull: false,
        },
        ReportDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'Reports',
        timestamps: false,
    }
);

module.exports = Report;
