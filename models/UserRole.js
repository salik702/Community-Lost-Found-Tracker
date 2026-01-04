const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * UserRole model for defining permission levels (e.g., Admin, Moderator, User).
 */
const UserRole = sequelize.define(
    'UserRole',
    {
        RoleID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        RoleName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'UserRoles',
        timestamps: false,
    }
);

module.exports = UserRole;
