const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define(
    'Alert',
    {
        AlertID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ItemID: {
            type: DataTypes.INTEGER,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        AlertDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        AlertType: {
            type: DataTypes.STRING(50),
        },
        Message: {
            type: DataTypes.TEXT,
        },
        IsRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'Alerts',
        timestamps: false,
    }
);

module.exports = Alert;
