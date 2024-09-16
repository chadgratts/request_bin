import { pool } from '../config/db';

const storeRequestDetails = async (binId: number, method: string, path: string,
  headers: any, receivedAt: string, mongoRequestId: string, mongoBodyId: string) => {
  try {
    await pool.query(
      'INSERT INTO request (bin_id, method, path, headers, received_at, mongo_request_id, mongo_body_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [binId, method, path, headers, receivedAt, mongoRequestId, mongoBodyId]
    );
  } catch (error) {
    console.error('Error inserting into PostgreSQL:', error);
  }
}

export { storeRequestDetails };