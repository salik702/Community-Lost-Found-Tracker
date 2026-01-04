const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Location model for tracking where items were lost, found, or reported.
 */
const Location = sequelize.define(
    'Location',
    {
        LocationID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        LocationName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        tableName: 'Locations',
        timestamps: false,
    }
);

module.exports = Location;
