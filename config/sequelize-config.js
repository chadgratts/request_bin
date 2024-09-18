const { Sequelize, QueryTypes } = require('sequelize');
const logger = require('../utils/logger');

const sequelize = new Sequelize('postgresql://postgres:bO5{Ug!E*B3Pe;K8m:uSsMmO@localhost:5432/requestbin', {
  logging: (message) => logger.info(message)
});

sequelize.authenticate()
  .then(() => {
    logger.info('Connected to PostgreSQL.');
  })
  .catch(err => {
    logger.error('PostgreSQL connection error:', err);
  });

module.exports = {
  sequelize,
  QueryTypes
}