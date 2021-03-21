import asyncHandler from 'express-async-handler';
import ClientHotspot from '../models/ClientHotspotModel.js';
import Client from '../models/ClientModel.js';
import Wallet from '../models/WalletModel.js';
import { generateToken } from '../utils/generateToken.js';

// desc: client login
// routes: api/client/login
// access: public
// method: post
const clientLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const client = await Client.findOne({ username });

  if (client) {
    if (await client.verifyPassword(password)) {
      res.status(200).json({
        _id: client._id,
        username: client.username,
        _ctoken: generateToken(client._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid Credential!');
    }
  } else {
    res.status(401);
    throw new Error('Invalid Credential!');
  }
});
// desc: get single client with hotspot by client
// routes: api/client/getClientProfileByClient/:clientId
// access: private
// method: get
const getClientProfileByClient = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId).select('-password');
  if (client) {
    const client_hotspot = await ClientHotspot.find({
      client_id: clientId,
    });
    const clientWallet = await Wallet.findOne({ client_id: clientId });

    if (client_hotspot.length < 0) {
      res.status(200).json({
        client: client,
        client_hotspot: [],
        clientWallet: {},
      });
    } else {
      res.status(200).json({
        client: client,
        client_hotspot: client_hotspot,
        clientWallet: clientWallet,
      });
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});

export { clientLogin, getClientProfileByClient };
