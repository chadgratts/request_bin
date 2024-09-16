import { mongoConnection } from '../config/db';
import { Schema } from 'mongoose';

const rawRequestSchema = new Schema({
  request_raw: { type: String },
}, { versionKey: false });

const RawRequest = mongoConnection.model('RawRequest', rawRequestSchema, 'mongo_requests');

export default RawRequest;