// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Sequelize, QueryTypes } = require('sequelize');

const generateUniqueEndpoint = async () => {
  const { customAlphabet } = await import('nanoid');

  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);
  return nanoid();
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB and PostgreSQL
mongoose.connect('mongodb://requestbin:PGWun5fc9Wi2JJA82EUD5gWa@localhost:27017/requestbin');
console.log('Connected to MongoDB');
const sequelize = new Sequelize('postgresql://postgres:bO5{Ug!E*B3Pe;K8m:uSsMmO@localhost:5432/requestbin');
console.log('Connected to PostgreSQL');


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

// Create a new bin (POST request)
app.post('/createbin', async (req, res) => {
  try {
    const generatedEndpoint = await generateUniqueEndpoint();
    const currentTime = new Date().toISOString();

    console.log(generateUniqueEndpoint);
    console.log(currentTime);
  
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
      res.status(200).json({ info: 'no requests in bin' });
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
      const { id, bin_id, mongo_request_id, mongo_body_id, ...reconstructedRequest } = requestDetails;
      reconstructedRequest.body = mongoBinBodies[idx];
      return reconstructedRequest;
    });

    res.status(200).json(reconstructedRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fetch requests for a bin (GET request to /bin/:binId/requests)
// app.get('/bin/:binId/requests', async (req, res) => {
//   const { binId } = req.params;
//   try {
//     const requests = await Request.find({ binId });
//     // request something from postgres here too?
//     res.status(200).json({ requests });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// Handle incoming requests to endpoint (POST/GET to /bin/:binId)
app.all('/bin/:binId', async (req, res) => {
  const { binId } = req.params;
  try {
    // Find bin that the endpoint belongs to
    const bin = await Bin.findByPk(binId);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    // Store request in MongoDB AND postgreSQL!
    const newRequest = new Request({
      binId,
      method: req.method,
      headers: req.headers,
      body: req.body,
    });
    await newRequest.save();
    // how does the frontend get new request data from here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});