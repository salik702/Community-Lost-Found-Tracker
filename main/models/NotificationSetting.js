const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotificationSetting = sequelize.define(
    'NotificationSetting',
    {
        SettingID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        EmailAlerts: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        SMSAlerts: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        PushAlerts: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'NotificationSettings',
        timestamps: false,
    }
);

module.exports = NotificationSetting;
