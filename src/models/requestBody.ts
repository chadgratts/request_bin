import { mongoConnection } from "../config/db";
import { Schema } from 'mongoose';

const requestBodySchema = new Schema({
  request_body: { type: String }
}, { versionKey: false });

const RequestBody = mongoConnection.model('RequestBody', requestBodySchema, 'mongo_bodies');

export default RequestBody;