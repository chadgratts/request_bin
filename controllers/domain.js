const RequestBody = require('../models/requestBody');
const { sequelize, QueryTypes } = require('../config/sequelize-config');
const bcrypt = require('bcrypt');
const domainRouter = require('express').Router();
const generateUniqueEndpoint = require('../utils/endpointGenerator');

// (FE) Create a bin
domainRouter.post('/api/createbin', async (req, res) => {
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

// (FE) Navigate to a bin
domainRouter.get('/api/bin/:endpoint', async (req, res) => {
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
      const { bin_id, path, mongo_request_id, mongo_body_id, ...reconstructedRequest } = requestDetails;
      reconstructedRequest.body = mongoBinBodies[idx];

      // Take the ID and hash it
      const saltRounds = 10;
      reconstructedRequest.id = bcrypt.hashSync(reconstructedRequest.id.toString(), saltRounds);

      return reconstructedRequest;
    });

    res.status(200).json(reconstructedRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = domainRouter;