// app.js
const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('./config/mongoose-config');
const { sequelize, QueryTypes } = require('./config/sequelize-config');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const logger = require('./utils/logger');

const generateUniqueEndpoint = async () => {
  const { customAlphabet } = await import('nanoid');
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);
  return nanoid();
}

// MongoDB models (extract this stuff later)
const rawRequestSchema = new mongoose.Schema({
  request_raw: { type: String },
}, { versionKey: false });
const RawRequest = mongoose.model('RawRequest', rawRequestSchema, 'mongo_requests');

const requestBodySchema = new mongoose.Schema({
  request_body: { type: String }
}, { versionKey: false });
const RequestBody = mongoose.model('RequestBody', requestBodySchema, 'mongo_bodies');

// Sync PostgreSQL models
// sequelize.sync();

const app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));


// Create a new bin (POST request)
app.post('/createbin', async (req, res) => {
  try {
    const generatedEndpoint = await generateUniqueEndpoint();
    const currentTime = new Date().toISOString();
  
    const [results, metadata] = await sequelize.query('INSERT INTO bin (endpoint, updated_at) VALUES ($1, $2)', {
      bind: [generatedEndpoint, currentTime],
      type: QueryTypes.INSERT
    });
    
    res.status(201).json({ message: 'Bin created!!', endpoint: `${generatedEndpoint}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
});

// User is navigating to a bin URL (i.e. if they remember their url)
app.get('/bin/:endpoint/', async (req, res) => {
  try {
    // Find the bin in pg
    const { endpoint } = req.params;
    const bin = await sequelize.query(`SELECT * FROM bin WHERE endpoint = '${endpoint}'`, {
      type: QueryTypes.SELECT
    });
    // Bin doesn't exist
    if (bin.length === 0) {
      res.status(404).json({ error: 'bin not found' });
      return;
    };

    // Find the request details in pg for any request(s) in the above bin
    const binId = bin[0].id;
    const pgBinRequests = await sequelize.query(`SELECT * FROM request WHERE bin_id = '${binId}'`, {
      type: QueryTypes.SELECT
    });
    // Bin has no requests in it
    if (pgBinRequests.length === 0) {
      res.status(200).json([]);
      return;
    }

    // Find the request bodies in mongo from any details found above
    const mongoBodyIds = pgBinRequests.map(request => request.mongo_body_id);
    const documents = await RequestBody.find({
      _id: { $in: mongoBodyIds } // Filter by mongo_body_ids
    });
    const mongoBinBodies = documents.map(doc => doc.request_body);

    // Add request bodies to details and strip unwanted details
    const reconstructedRequests = pgBinRequests.map((requestDetails, idx) => {
      const { bin_id, mongo_request_id, mongo_body_id, ...reconstructedRequest } = requestDetails;
      reconstructedRequest.body = mongoBinBodies[idx];

      // Take the ID and hash it
      const saltRounds = 10;
      reconstructedRequest.id = bcrypt.hashSync(reconstructedRequest.id.toString(), saltRounds);

      // Parse the query parameters out of the path
      reconstructedRequest.queryParams = {};

      if (reconstructedRequest.path.includes('?')) {
        let entireQueryParamString = reconstructedRequest.path.split('?');
        let queryParamArray = entireQueryParamString[1].split('&');

        queryParamArray.forEach(query => {
          [key, value] = query.split('=');
          reconstructedRequest.queryParams[key] = value;
        });
      }

      return reconstructedRequest;
    });

    res.status(200).json(reconstructedRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle incoming requests to endpoint (ANY requests to / that don't match above
app.all('/', async (req, res) => {
  try {
    logger.info('Incoming endpoint request:\n');
    const subdomain = req.headers.host.split('.')[0];
    logger.info(`Subdomain: ${subdomain}`);

    // Validate the subdomain (endpoint)
    if (!/^[a-z0-9]{12}$/.test(`${subdomain}`)) {
      logger.info('Rejected\n')
      res.status(404).json({ success: false });
      return;
    } else {
      logger.info('Accepted\n');
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
      const headers = Object.entries(req.headers)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\r\n') +
                        '\r\n\r\n';
      const currentTime = new Date().toISOString();

      try {
        await sequelize.query('INSERT INTO request (bin_id, method, path, headers, received_at, mongo_request_id, mongo_body_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', {
          bind: [binId, method, path, headers, currentTime, mongoRequestId, mongoBodyId],
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

const port = 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});