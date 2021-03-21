import express from 'express';
import {
  clientLogin,
  editSingleClientByClient,
  getClientProfileByClient,
  resetPassword,
} from '../controller/ClientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/login').post(clientLogin);
router
  .route('/getClientProfileByClient/:clientId')
  .get(protect, getClientProfileByClient);
router
  .route('/editSingleClientByClient/:clientId')
  .put(protect, editSingleClientByClient);
router.route('/resetPassword/:clientId').put(protect, resetPassword);

export default router;
