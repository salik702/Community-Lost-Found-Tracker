const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Match model for linking potential matches between lost and found items.
 */
const Match = sequelize.define(
    'Match',
    {
        MatchID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        LostItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        FoundItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        MatchDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        Status: {
            type: DataTypes.ENUM('Pending', 'Confirmed', 'Rejected'),
            defaultValue: 'Pending',
        },
    },
    {
        tableName: 'Matches',
        timestamps: false,
    }
);

module.exports = Match;
