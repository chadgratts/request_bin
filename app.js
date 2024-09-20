const express = require('express');
const cors = require('cors');
const domainRouter = require('./controllers/domain');
const subdomainRouter = require('./controllers/subdomain');
const morgan = require('morgan');
const logger = require('./utils/logger');

const app = express();

app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));

// Domain / Subdomain traffic router middleware
app.use((req, res, next) => {
  const host = req.headers.host;
  
  // UPDATE THIS
  if (host === 'localhost:3000') {
    logger.info('Incoming frontend request:\n');
    domainRouter(req, res, next);
  } else if (host.endsWith('localhost:3000') && host.split('.').length === 2) {
    logger.info('Incoming endpoint request:\n');
    subdomainRouter(req, res, next);
  } else {
    res.status(404).send('Not Found');
  }
});

module.exports = app;