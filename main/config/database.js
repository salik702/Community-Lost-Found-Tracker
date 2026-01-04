const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'tracker_user',
  password: 'tracker_password',
  database: 'CommunityTrackerDB',
  logging: false,
});

module.exports = sequelize;
