const mongoose = require('../config/mongoose-config');

const requestBodySchema = new mongoose.Schema({
  request_body: { type: String }
}, { versionKey: false });

const RequestBody = mongoose.model('RequestBody', requestBodySchema, 'mongo_bodies');

module.exports = RequestBody