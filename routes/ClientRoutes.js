import express from 'express';
import {
  addClient,
  clientLogin,
  addHotspotToClient,
} from '../controller/ClientController.js';

const router = express.Router();

router.route('/addNewClient').post(addClient);
router.route('/login').post(clientLogin);
router.route('/addHotspot').post(addHotspotToClient);

export default router;
