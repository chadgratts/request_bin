import express from 'express';
import { captureRequest } from '../controllers/requestController';

const router = express.Router();
router.all('/', captureRequest);

export default router;