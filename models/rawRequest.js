const mongoose = require('../config/mongoose-config');

const rawRequestSchema = new mongoose.Schema({
  request_raw: { type: String },
}, { versionKey: false });

const RawRequest = mongoose.model('RawRequest', rawRequestSchema, 'mongo_requests');

module.exports = RawRequest;