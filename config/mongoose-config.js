const mongoose = require('mongoose');
const logger = require('../utils/logger');

mongoose.connect('mongodb://requestbin:PGWun5fc9Wi2JJA82EUD5gWa@localhost:27017/requestbin')
  .then(() => {
    logger.info('Connected to MongoDB.');
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
  })

mongoose.set('debug', function(coll, method, query, doc, options) {
  logger.info(`Mongoose ${method} on ${coll}:`, {
    query,
    doc,
    options
  });
});

module.exports = mongoose;