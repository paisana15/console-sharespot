import express from 'express';
import { addClient, clientLogin } from '../controller/ClientController.js';

const router = express.Router();

router.route('/addNewClient').post(addClient);
router.route('/login').post(clientLogin);

export default router;
