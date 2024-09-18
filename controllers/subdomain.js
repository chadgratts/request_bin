const RawRequest = require('../models/rawRequest');
const RequestBody = require('../models/requestBody');
const { sequelize, QueryTypes } = require('../config/sequelize-config');
const bcrypt = require('bcrypt');
const subdomainRouter = require('express').Router();

// (Endpoint) Send a request to an endpoint
subdomainRouter.all('*', async (req, res) => {
  try {
    const subdomain = req.headers.host.split('.')[0];
    logger.info(`Subdomain: ${subdomain}`);

    // Validate the subdomain (endpoint)
    if (!/^[a-z0-9]{12}$/.test(`${subdomain}`)) {
      logger.info('Rejected.\n')
      res.status(404).json({ success: false });
      return;
    } else {
      logger.info('Accepted.\n');
    }

    // Find the bin in pg
    const bin = await sequelize.query(`SELECT * FROM bin WHERE endpoint = '${subdomain}'`, {
      type: QueryTypes.SELECT
    });
    // Bin doesn't exist
    if (bin.length === 0) {
      res.status(404).json({ success: false });
      return;
    };

    // Capture the request

    // Reconstruct the request body into a string
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    // Reconstruct the entire raw request into a string
    req.on('end', async () => {
      const fullRawRequest = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
        Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`).join('\r\n') +
        '\r\n\r\n' +
        rawBody;

      // Save raw request and request body to Mongo
      let mongoRequestId;
      let mongoBodyId;
      const rawRequest = new RawRequest({ request_raw: fullRawRequest });
      const requestBody = new RequestBody({ request_body: rawBody });

      try {
      const savedRawRequest = await rawRequest.save();
      mongoRequestId = savedRawRequest._id.toString();

      const savedRequestBody = await requestBody.save();
      mongoBodyId = savedRequestBody._id.toString();

      logger.info('Saved request and body to MongoDB.');
      } catch (err) {
        logger.error('Failed to save documents to MongoDB:', err);
      }

      // Save the other request details to Postgres (use the IDs from Mongo)
      const binId = bin[0].id;
      const method = req.method;
      const path = req.path;
      const originalUrl = req.originalUrl;
      const queryParams = req.query;
      const headers = req.headers;
      const currentTime = new Date().toISOString();

      try {
        await sequelize.query('INSERT INTO request (bin_id, method, path, original_url, query_parameters, headers, received_at, mongo_request_id, mongo_body_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', {
          bind: [binId, method, path, originalUrl, queryParams, headers, currentTime, mongoRequestId, mongoBodyId],
          type: QueryTypes.INSERT
        });
        logger.info('Saved request details to PostgrSQL.');
      } catch (err) {
        logger.error('Failed to save request details to PostgreSQL:', err);
      }
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = subdomainRouter;