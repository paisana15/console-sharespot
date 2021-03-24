import express from 'express';
import {
  clientLogin,
  editSingleClientByClient,
  getClientProfileByClient,
  resetPassword,
  getHotspotRewardByClient,
  clientWithdrawRequest,
  getWithdrawHistory,
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
router
  .route('/getRewardByClient/:clientId')
  .put(protect, getHotspotRewardByClient);
router.route('/withdrawRequest/:clientId').post(protect, clientWithdrawRequest);
router.route('/getWithdrawHistory/:clientId').get(protect, getWithdrawHistory);

export default router;
