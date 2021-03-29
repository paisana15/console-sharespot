import asyncHandler from 'express-async-handler';
import ClientHotspot from '../models/ClientHotspotModel.js';
import Client from '../models/ClientModel.js';
import Wallet from '../models/WalletModel.js';
import { generateToken } from '../utils/generateToken.js';
import { updateWalletBalance } from './AdminController.js';
import WithdrawRequest from '../models/WithdrawRequestModel.js';
import axios from 'axios';
import moment from 'moment';
import WithdrawHistory from '../models/WithdrawHistoryModel.js';
import ManualWithdrawHistory from '../models/ManualWithdrawHistoryModel.js';

// desc: client login
// routes: api/client/login
// access: public
// method: post
const clientLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const client = await Client.findOne({ username }).select('password');

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
  const client = await Client.findById(clientId).select('password');
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

const getHotspotRewardByClient = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId);
  if (client) {
    if (client._id.equals(req.user?._id)) {
      let clientHotspots = [];
      const client_assigned_hotspot = await ClientHotspot.find({
        client_id: clientId,
      });

      client_assigned_hotspot.map(async (data) => {
        const minDate = moment(data?.startDate).format('YYYY-MM-DD');
        const response = await axios.get(
          `https://api.helium.io/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=2030-08-27&min_time=${minDate}`
        );
        if (response?.data) {
          const val = (response?.data?.data?.total * data?.percentage) / 100;
          clientHotspots.push({
            total: val,
          });
          data.total_earned = val;
          await data.save();
        } else {
          res.status(404);
          throw new Error('Failed to fetch data!');
        }
      });

      setTimeout(async () => {
        if (clientHotspots.length > 0) {
          const total = clientHotspots
            .map((data) => data.total)
            .reduce((acc, curr) => {
              return acc + curr;
            }, 0);
          const totalEarn = total.toFixed(2);

          await updateWalletBalance(clientId, totalEarn, false);

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
          throw new Error('Client hotspot not found!');
        }
      }, 5000);
    } else {
      res.status(400);
      throw new Error('You are not authorized to do this!');
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});

const clientWithdrawRequest = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client_user = await Client.findById(clientId);
  if (client_user) {
    if (client_user._id.equals(req.user?._id)) {
      const { amount } = req.body;
      const clientWallet = await Wallet.findOne({
        client_id: client_user?._id,
      });
      if (parseFloat(clientWallet.pendingPayment) === 0) {
        if (parseFloat(amount) > parseFloat(clientWallet?.wallet_balance)) {
          res.status(400);
          throw new Error(
            'Invalid amount! Withdraw amount is greater then wallet balance!'
          );
        } else {
          clientWallet.pendingPayment = amount;
          const update = await clientWallet.save();
          if (update) {
            const newWithdrawRequest = await WithdrawRequest.create({
              wallet: clientWallet?._id,
              client: client_user._id,
              amount: amount,
            });
            if (newWithdrawRequest) {
              res.status(200).json({ message: 'Withdraw Request Received!' });
            } else {
              res.status(500);
              throw new Error('Could not receive withdrawal request!');
            }
          }
        }
      } else {
        res.status(400);
        throw new Error(
          `You already have a pending withdrawal request for HNT ${clientWallet.pendingPayment}!`
        );
      }
    } else {
      res.status(400);
      throw new Error('You are not authorized to perform this action!');
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});

const getWithdrawHistory = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client_user = await Client.findById(clientId);
  if (client_user) {
    const w_reqs = await WithdrawHistory.find({ client: clientId });
    if (w_reqs) {
      const mw_histories = await ManualWithdrawHistory.find({
        client_id: clientId,
      });
      if (mw_histories.length > 0) {
        mw_histories.map((data) => {
          const newObj = {
            client: data?.client_id,
            amount: data?.mw_amount,
            transaction: '',
          };
          w_reqs.push(newObj);
        });
        setTimeout(() => {
          res.status(200);
          res.json(w_reqs);
        }, 3000);
      } else {
        res.status(200);
        res.json(w_reqs);
      }
    } else {
      res.status(404);
      throw new Error('No histories!');
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
  getHotspotRewardByClient,
  clientWithdrawRequest,
  getWithdrawHistory,
};
