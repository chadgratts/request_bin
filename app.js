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

// tzf9n4rhgkgl
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB and PostgreSQL
mongoose.connect('mongodb://localhost:27017/requestbin', { useNewUrlParser: true, useUnifiedTopology: true }); // may not need
const sequelize = new Sequelize('postgres://chadgratts:password@localhost:5432/requestbin');


// Sync PostgreSQL models
// sequelize.sync();

// Create a new bin (POST request)
app.post('/createbin', async (req, res) => { // POST https://ourdomain.com/createbin
  // endpoint char(12) UNIQUE NOT NULL,
  // updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP

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
app.get('/bin/:binId/', async (req, res) => { // GET https://ourdomain.com/bin/tzf9n4rhgkgl 
  // logic to get the endpoint aka tzf9n4rhgkgl
  // query bin table to see if tzf9n4rhgkgl exists, save the PK ID to variable if so

  // no: respond 404

  // yes: query request table and get any requests that match the bin ID
    // search request table for PK bin ID === FK bin_id, if none: return no requests
      // take the first record and get its mongo_request_id
        // search mongo (mongo_requests) for any documents that have mongo_request_id, if none: return no requests
  try {
    const { binId } = req.params;

    const bin = await sequelize.query(`SELECT * FROM bin WHERE endpoint = '${binId}'`, {
      type: QueryTypes.SELECT
    });
  
    if (bin.length === 0) {
      res.status(404).json({ error: 'bin not found' });
    };

    res.status(200).send('hi');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fetch requests for a bin (GET request to /bin/:binId/requests)
app.get('/bin/:binId/requests', async (req, res) => {
  const { binId } = req.params;
  try {
    const requests = await Request.find({ binId });
    // request something from postgres here too?
    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// SELECT * FROM bin;

// DROP TABLE bin;

// id |   endpoint   |         updated_at         
// ----+--------------+----------------------------
//   1 | 468sv9n8otnl | 2024-09-16 18:17:25.662-04

// localhost:3000/bin/468sv9n8otnl

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