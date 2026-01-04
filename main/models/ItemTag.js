const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemTag = sequelize.define(
    'ItemTag',
    {
        TagID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        TagName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: 'ItemTags',
        timestamps: false,
    }
);

module.exports = ItemTag;
