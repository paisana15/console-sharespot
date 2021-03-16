import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import clientRoutes from './routes/ClientRoutes.js';
import ClientHotspot from './models/ClientHotspotModel.js';
import axios from 'axios';
dotenv.config();

// db connect
connectDB();

const app = express();
const server = http.createServer(app);

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

  setInterval(async () => {
    try {
      const clients = await ClientHotspot.find({});
      if (clients) {
        clients.map(async (data) => {
          await axios.put(
            `http://localhost:5001/api/clients/getRewards/${data?.client_id}`
          );
        });
      } else {
        throw new Error('Client fething failed!');
      }
    } catch (error) {
      console.log(error);
    }
  }, 10000);
  // https.get(
  //   'https://api.helium.io/v1/hotspots/11mP5o3e8VgCxh6x5nz3j4hq3B4igvCdwdLY9fkY5WEn497A8ZU/rewards/sum?max_time=2030-08-27&min_time=2019-01-01',
  //   (res) => {
  //     const body = [];
  //     res.on('data', (d) => {
  //       body.push(d);
  //     });
  //     res.on('end', () => {
  //       console.log(Buffer.concat(body).toString());
  //     });
  //   }
  // );
});
