import asyncHandler from 'express-async-handler';
import Client from '../models/ClientModel.js';
import ClientHotspot from '../models/ClientHotspotModel.js';
import { generateToken } from '../utils/generateToken.js';

// desc: admin add new clients
// routes: api/clients/addNewClient
// access: private
// method: post
const addClient = asyncHandler(async (req, res) => {
  const newClient = await Client.create(req.body);
  if (newClient) {
    res.status(200).json({
      status: 'ok',
      message: 'Client added!',
    });
  } else {
    res.status(400);
    throw new Error('Client registered failed!');
  }
});
// desc: client login
// routes: api/clients/login
// access: public
// method: post
const clientLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const client = await Client.findOne({ username });
  if (client && (await client.verifyPassword(password))) {
    res.status(200).json({
      _id: client._id,
      username: client.username,
      token: generateToken(client._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credential!');
  }
});
// desc: admin add hotspot to client
// routes: api/clients/addHotspotToClient
// access: private
// method: post
const addHotspotToClient = asyncHandler(async (req, res) => {
  const { client_id, hotspot_address, relation_type } = req.body;

  const client = await Client.findById(client_id);
  const client_has_current_hostpot = await ClientHotspot.find({
    client_id: client_id,
    hotspot_address: hotspot_address,
  });
  if (client) {
    if (client_has_current_hostpot.length > 0) {
      console.log(client_has_current_hostpot);
      res.status(400);
      throw new Error(`This hotspot is already assigned to this client!`);
    } else {
      if (relation_type === 'host') {
        const hotspot_has_host = await ClientHotspot.find({
          hotspot_address: hotspot_address,
          relation_type: 'host',
        });

        if (hotspot_has_host.length > 0) {
          res.status(400);
          throw new Error(
            "This hotspot already assigned as host, can't be assign!"
          );
        } else {
          const newConnection = await ClientHotspot.create(req.body);
          if (newConnection) {
            res.status(200).json(newConnection);
          } else {
            throw new Error();
          }
        }
      } else {
        const newConnection = await ClientHotspot.create(req.body);
        if (newConnection) {
          res.status(200).json(newConnection);
        } else {
          res.status(500);
          throw new Error('Hotspot adding failed!');
        }
      }
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});

export { addClient, clientLogin, addHotspotToClient };
