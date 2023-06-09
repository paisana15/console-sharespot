dotenv.config();
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import adminRoutes from './routes/AdminRoutes.js';
import clientRoutes from './routes/ClientRoutes.js';
import axios from 'axios';
import cors from 'cors';
import { corsWithOptions } from './routes/cors.js';

// db connect
connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// set cors preflight options
app.options('*', cors());
app.use(corsWithOptions);

// routes
app.get('/', (req, res) => {
  res.end('Server running...');
});
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);

// middleware
app.use(notFound);
app.use(errorHandler);

// server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, 'api', () => {
  console.log(`\n---Server listening on port ${PORT}---`);
  setInterval(async () => {
    try {
      const getReward = await axios.put(
        `${process.env.PROD_SERVER}/api/admin/getRewardsByServer`
      );
      if (!getReward) {
        console.log('Failed to update clients reward!');
      }
    } catch (error) {
      console.log(error);
    }
  }, 43200 * 1000);
});
