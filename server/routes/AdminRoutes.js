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
router.route('/getRewards/:clientId').put(verifyAdmin, getHotspotReward);
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

export default router;
