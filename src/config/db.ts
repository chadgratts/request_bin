import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import pg from 'pg';
const { Pool } = pg;

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

const mongoConnection = await mongoose.createConnection(mongoURI);
console.log('Connected to MongoDB');

// PostgreSQL Connection
const connectionString = process.env.POSTGRES_URI;
const pool = new Pool({ connectionString });
console.log('Connected to PostgreSQL');

export { mongoConnection, pool };