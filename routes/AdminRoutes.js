import express from 'express';
import {
  addClient,
  addHotspotToClient,
  getHotspotReward,
  getAllClients,
  adminLogin,
  getClientsHotspot,
  getSingleClientHotspots,
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

export default router;
