import express from 'express';
import {
  addClient,
  clientLogin,
  addHotspotToClient,
  getHotspotReward,
  getAllClients,
} from '../controller/ClientController.js';

const router = express.Router();

router.route('/addNewClient').post(addClient);
router.route('/login').post(clientLogin);
router.route('/addHotspot').post(addHotspotToClient);
router.route('/getRewards/:clientId').put(getHotspotReward);
router.route('/getAllClients').get(getAllClients);

export default router;
