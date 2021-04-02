import express from 'express';
import {
  addClient,
  addHotspotToClient,
  getHotspotReward,
  getAllClients,
  adminLogin,
  getClientsHotspot,
  getSingleClientHotspots,
  editSingleClient,
  editHotspotToClient,
  deleteClient,
  deleteHotspot,
  getWithdrawalRequests,
  withdrawalRequestAccept,
  withdrawalRequestReject,
  getMainSecondWallet,
  addManualWithdraw,
  getManulaWithdrawHistory,
  deleteManualWithdraw,
  getWithdrawHistoryByAdmin,
  getHotspotRewardByS,
  getHotspotRewardByAdmin,
} from '../controller/AdminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/login').post(adminLogin);
router.route('/addNewClient').post(verifyAdmin, addClient);
router.route('/getClientsHotspot').get(verifyAdmin, getClientsHotspot);
router
  .route('/getSingleClientHotspots/:clientId')
  .get(verifyAdmin, getSingleClientHotspots);
router.route('/getAllClients').get(verifyAdmin, getAllClients);
router.route('/addHotspot').post(verifyAdmin, addHotspotToClient);
router.route('/getRewards/:clientId').put(getHotspotReward);
router.route('/getRewardsByServer').put(getHotspotRewardByS);
router.route('/getRewardsByAdmin').put(verifyAdmin, getHotspotRewardByAdmin);
router.route('/editClientProfile/:clientId').put(verifyAdmin, editSingleClient);
router.route('/editHotspot/:hotspotId').put(verifyAdmin, editHotspotToClient);
router.route('/deleteClient/:clientId').delete(verifyAdmin, deleteClient);
router
  .route('/deleteHotspot/:hotspotId/:clientId')
  .delete(verifyAdmin, deleteHotspot);
router.route('/getWithdrawalRequests').get(verifyAdmin, getWithdrawalRequests);
router
  .route('/withdrawalRequestAccept/:wreqId/accept')
  .put(verifyAdmin, withdrawalRequestAccept);
router
  .route('/withdrawalRequestReject/:wreqId/reject')
  .put(verifyAdmin, withdrawalRequestReject);
router.route('/getMainSecondWallet').get(verifyAdmin, getMainSecondWallet);
router
  .route('/addManualWithdraw/:clientId')
  .put(verifyAdmin, addManualWithdraw);
router
  .route('/getManulaWithdrawHistory/:clientId')
  .get(verifyAdmin, getManulaWithdrawHistory);
router
  .route('/deleteManualWithdraw/:historyId')
  .delete(verifyAdmin, deleteManualWithdraw);
router
  .route('/getWithdrawHistoryByAdmin/:clientId')
  .get(verifyAdmin, getWithdrawHistoryByAdmin);

export default router;
