const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecoveryMethod = sequelize.define(
    'RecoveryMethod',
    {
        MethodID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        MethodName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        tableName: 'RecoveryMethods',
        timestamps: false,
    }
);

module.exports = RecoveryMethod;
