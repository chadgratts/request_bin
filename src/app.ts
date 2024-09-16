import express from 'express';
import morgan from 'morgan';
import requestRoutes from './routes/requestRoutes';

const app = express();

app.use(morgan('common'));
app.use('/', requestRoutes);

export default app;