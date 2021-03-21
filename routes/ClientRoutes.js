import express from 'express';
import {
  clientLogin,
  getClientProfileByClient,
} from '../controller/ClientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/login').post(clientLogin);
router
  .route('/getClientProfileByClient/:clientId')
  .get(protect, getClientProfileByClient);

export default router;
