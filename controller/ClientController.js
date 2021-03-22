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
// desc: admin edit client profile
// routes: api/admin/editClientProfile/:clientId
// access: private
// method: get
const editSingleClientByClient = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById({ _id: clientId });
  if (client) {
    if (client._id.equals(req.user?._id)) {
      const { username, email, phone_number, wallet_address } = req.body;
      const clientExistwUsername = await Client.findOne({ username: username });
      if (
        !clientExistwUsername ||
        clientExistwUsername._id.equals(client._id)
      ) {
        const clientExistwEmail = await Client.findOne({ email: email });
        if (!clientExistwEmail || clientExistwEmail._id.equals(client._id)) {
          const clientExistwPhone = await Client.findOne({
            phone_number: phone_number,
          });
          if (!clientExistwPhone || clientExistwPhone._id.equals(client._id)) {
            const clientExistwWallet = await Client.findOne({
              wallet_address: wallet_address,
            });
            if (
              !clientExistwWallet ||
              clientExistwWallet._id.equals(client._id)
            ) {
              const update = await Client.findOneAndUpdate(
                { _id: client._id },
                { $set: req.body },
                { new: true }
              );
              if (update) {
                res.status(200).json(update);
              } else {
                res.status(500);
                throw new Error('Client profile update failed!');
              }
            } else {
              res.status(400);
              throw new Error('Client already exist with this wallet!');
            }
          } else {
            res.status(400);
            throw new Error('Client already exist with this phone number!');
          }
        } else {
          res.status(400);
          throw new Error('Client already exist with this email!');
        }
      } else {
        res.status(400);
        throw new Error('Username taken! Try again!');
      }
    } else {
      res.status(400);
      throw new Error('You are not authorized to edit this information!');
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});

// desc: get single client with hotspot by client
// routes: api/client/getClientProfileByClient/:clientId
// access: private
// method: get
const resetPassword = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId);
  if (client) {
    const { preP, newP, conP } = req.body;

    if (client?._id.equals(req.user?._id)) {
      if (await client.verifyPassword(preP)) {
        if (newP.toString() === conP.toString()) {
          client.password = newP;
          const update = await client.save();
          if (update) {
            res.status(200).json({
              message: 'Password Reset Successfull!',
            });
          } else {
            res.status(500);
            throw new Error();
          }
        } else {
          res.status(400);
          throw new Error('New Password does not match!');
        }
      } else {
        res.status(400);
        throw new Error('Previous password does not match!');
      }
    } else {
      res.status(400);
      throw new Error('You are not authorized to edit this information!');
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});

export {
  clientLogin,
  getClientProfileByClient,
  editSingleClientByClient,
  resetPassword,
};
