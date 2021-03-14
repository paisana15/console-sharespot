import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import clientRoutes from './routes/ClientRoutes.js';
dotenv.config();

// db connect
connectDB();

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.get('/', (req, res) => {
  res.end('Server running...');
});
app.use('/api/clients', clientRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n---------Server listening on port ${PORT}---------`);
});
