import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import pg from 'pg';
const { Pool } = pg;

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

const mongoConnection = await mongoose.createConnection(mongoURI);
console.log('Connected to MongoDB');

// Schema
const rawRequestSchema = new mongoose.Schema({
  request_raw: { type: String }
});

const requestBodySchema = new mongoose.Schema({
  request_body: { type: String }
});

// Model
const RawRequest = mongoConnection.model('RawRequest', rawRequestSchema, 'mongo_requests');

const RequestBody = mongoConnection.model('RequestBody', requestBodySchema, 'mongo_bodies');

// PostgreSQL Connection
const connectionString = process.env.POSTGRES_URI;
const pool = new Pool({ connectionString });

export { RawRequest, RequestBody, pool };