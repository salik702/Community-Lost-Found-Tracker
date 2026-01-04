const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserActivityLog = sequelize.define(
    'UserActivityLog',
    {
        LogID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ActionType: {
            type: DataTypes.STRING(50),
        },
        ActionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        Description: {
            type: DataTypes.TEXT,
        },
    },
    {
        tableName: 'UserActivityLogs',
        timestamps: false,
    }
);

module.exports = UserActivityLog;
