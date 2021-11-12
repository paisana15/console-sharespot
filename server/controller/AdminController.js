import asyncHandler from 'express-async-handler';
import Admin from '../models/AdminModel.js';
import Client from '../models/ClientModel.js';
import ClientHotspot from '../models/ClientHotspotModel.js';
import Wallet from '../models/WalletModel.js';
import { generateToken } from '../utils/generateToken.js';
import axios from 'axios';
import moment from 'moment';
import WithdrawRequest from '../models/WithdrawRequestModel.js';
import WithdrawHistory from '../models/WithdrawHistoryModel.js';
import ManualWithdrawHistory from '../models/ManualWithdrawHistoryModel.js';
import nodemailer from 'nodemailer';
import emailValidator from 'email-validator';
import _ from 'lodash';
import MwSwBalance from '../models/MwSwBalancesModel.js';
import { sendEmail } from '../utils/sendEmail.js';
import { htmlBodyClientEmail } from '../constants/htmlBodyClientEmail.js';

// desc: admin login
// endpoint: host_url/api/admin/login         host_url means '127.0.0.1:5001' (localhost) or 'prod server url' (e.g: api.somthing.likethis)
// access: private
// method: post
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body.credentials;

  const admin = await Admin.findOne({ username });

  if (admin && admin?.password.toString() === password.toString()) {
    res.status(200).json({
      _atoken: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credential!');
  }
});
// desc: admin add new clients
// endpoint: host_url/api/admin/addNewClient
// access: private
// method: post
const addClient = asyncHandler(async (req, res) => {
  const { username, email, phone_number, wallet_address } = req.body;
  if (await Client.findOne({ email })) {
    res.status(400);
    throw new Error('This email is registered already!');
  } else if (await Client.findOne({ username })) {
    res.status(400);
    throw new Error('Username Taken! Try again...!');
  } else if (await Client.findOne({ phone_number })) {
    res.status(400);
    throw new Error('This phone number is already used!');
  } else if (await Client.findOne({ wallet_address })) {
    res.status(400);
    throw new Error('This wallet address is already used!');
  } else {
    const newClient = await Client.create(req.body);
    if (newClient) {
      // creating client wallet
      const createClientWallet = await Wallet.create({
        client_id: newClient?._id,
        totalRewards: 0.0,
        totalWithdraw: 0.0,
        wallet_balance: 0.0,
      });
      if (createClientWallet) {
        const client = await Client.findById({ _id: newClient._id }).select(
          '-password'
        );
        res.status(201).json(client);
      } else {
        res.status(500);
        throw new Error('Failed to create client wallet!');
      }
      // client created successfully
    } else {
      res.status(500);
      throw new Error('Client registration failed!');
    }
  }
});
// desc: admin delete a client
// endpoint: host_url/api/admin/deleteClient/:clientId
// access: private
// method: del
const deleteClient = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId);
  if (client) {
    const clientHotspots = await ClientHotspot.find({ client_id: client._id });
    const clientWallets = await Wallet.findOne({ client_id: client._id });
    if (clientHotspots !== null) {
      // deleting all hostpot assigned to this client
      await ClientHotspot.deleteMany(
        { client_id: clientId },
        (error, result) => {
          if (error) {
          }
        }
      );
    }
    if (clientWallets) {
      // deleting client wallet
      await Wallet.deleteOne({ client_id: client._id });
    }
    const del = await client.remove();
    if (del) {
      // client deleted
      res.status(200).json({
        message: 'Client deleted successfully!',
      });
    } else {
      res.status(500);
      throw new Error();
    }
  } else {
    res.status(404);
    throw new Error('Clinet not found!');
  }
});
// desc: get all clients list
// endpoint: host_url/api/admin/getAllClients
// access: public
// method: get
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Wallet.find({}).populate('client_id');
  if (clients) {
    res.status(200).json(clients);
  } else {
    res.status(404);
    throw new Error('No clients found!');
  }
});
// desc: admin add hotspot to client
// endpoint: host_url/api/admin/addHotspotToClient
// access: private
// method: post
const addHotspotToClient = asyncHandler(async (req, res) => {
  const { client_id, hotspot_address, relation_type } = req.body;

  const client = await Client.findById(client_id);
  const client_has_current_hostpot = await ClientHotspot.find({
    client_id: client_id,
    hotspot_address: hotspot_address.split(' ')[1],
  });
  if (client) {
    const h_name = req.body.hotspot_address.split(' ')[0];
    const h_address = req.body.hotspot_address.split(' ')[1];
    // if (relation_type === 'host') {
    //   const hotspot_has_host = await ClientHotspot.find({
    //     hotspot_address: h_address,
    //     relation_type: 'host',
    //   });
    //   if (hotspot_has_host.length > 0) {
    //     res.status(400);
    //     throw new Error(
    //       "This hotspot already assigned as host, can't be assign!"
    //     );
    //   } else {
    //     const newConnection = await ClientHotspot.create({
    //       hotspot_name: h_name,
    //       hotspot_address: h_address,
    //       client_id: req.body.client_id,
    //       relation_type: req.body.relation_type,
    //       percentage: req.body.percentage,
    //       startDate: req.body.startDate,
    //       endDate: req.body.endDate,
    //     });
    //     if (newConnection) {
    //       client.total_hotspot = parseInt(client.total_hotspot) + 1;
    //       const update = await client.save();
    //       if (update) {
    //         res.status(201).json(newConnection);
    //       } else {
    //         res.status(500);
    //         throw new Error('Failed to save client!');
    //       }
    //     } else {
    //       throw new Error();
    //     }
    //   }
    // } else {
    const newConnection = await ClientHotspot.create({
      hotspot_name: h_name,
      hotspot_address: h_address,
      client_id: req.body.client_id,
      relation_type: req.body.relation_type,
      percentage: req.body.percentage,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    if (newConnection) {
      client.total_hotspot = parseInt(client.total_hotspot) + 1;
      const update = await client.save();
      if (update) {
        res.status(201).json(newConnection);
      } else {
        res.status(500);
        throw new Error('Failed to save client!');
      }
    } else {
      res.status(500);
      throw new Error('Hotspot adding failed!');
    }
    // }
    //}
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});
// desc: admin edit client hotspot
// endpoint: host_url/api/admin/addHotspotToClient
// access: private
// method: put
const editHotspotToClient = asyncHandler(async (req, res) => {
  const hotspotId = req.params.hotspotId;
  const hotspot = await ClientHotspot.findById(hotspotId);
  if (hotspot) {
    const { hotspot_address } = req.body;
    const h_name = hotspot_address.split(' ')[0];
    const h_address = hotspot_address.split(' ')[1];
    const client = await Client.findById({ _id: hotspot.client_id });
    if (client) {
      hotspot.client_id = req.body.client_id || hotspot.client_id;
      hotspot.hotspot_name = h_name || hotspot.hotspot_name;
      hotspot.hotspot_address = h_address || hotspot.hotspot_address;
      hotspot.percentage = req.body.percentage || hotspot.percentage;
      hotspot.startDate = req.body.startDate || hotspot.startDate;
      hotspot.endDate = req.body.endDate || hotspot.endDate;
      hotspot.relation_type = req.body.relation_type || hotspot.relation_type;
      const update = await hotspot.save();
      if (update) {
        res.status(200);
        res.json(update);
      } else {
        res.status(500);
        throw new Error('Hotspot upload failed!');
      }
    } else {
      res.status(404);
      throw new Error('Client not found!');
    }
  } else {
    res.status(404);
    throw new Error('Hotspot not found!');
  }
});
// desc: get clients assigned hotspot
// endpoint: host_url/api/admin/getClientsHotspot
// access: private
// method: get
const getClientsHotspot = asyncHandler(async (req, res) => {
  const clients = await ClientHotspot.find({}).populate('client_id');
  if (clients) {
    res.status(200).json(clients);
  } else {
    res.status(404);
    throw new Error('Clients fetch failed!');
  }
});
// desc: get single client with hotspot
// endpoint: host_url/api/admin/getSingleClient/:clientId
// access: private
// method: get
const getSingleClientHotspots = asyncHandler(async (req, res) => {
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
// endpoint: host_url/api/admin/editClientProfile/:clientId
// access: private
// method: put
const editSingleClient = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById({ _id: clientId });
  if (client) {
    const { username, email, phone_number, wallet_address } = req.body;
    const clientExistwUsername = await Client.findOne({ username: username });
    if (!clientExistwUsername || clientExistwUsername._id.equals(client._id)) {
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
    res.status(404);
    throw new Error('Client not found!');
  }
});

// updating client wallet balance, it takes 3 params clientId, updatedBalance, deleteHostpot (true, when deleting a assigned hotspot of client, else false)
const updateWalletBalance = async (clientId, balance, deleteHotspot) => {
  try {
    const client_wallet = await Wallet.findOne({ client_id: clientId });
    if (client_wallet) {
      if (deleteHotspot) {
        if (client_wallet.totalRewards !== 0) {
          client_wallet.totalRewards =
            parseFloat(client_wallet.totalRewards) -
            parseFloat(balance?.toFixed(2));
        } else {
          client_wallet.totalRewards = 0;
        }
      } else {
        client_wallet.totalRewards = parseFloat(balance);
      }

      client_wallet.wallet_balance =
        parseFloat(client_wallet.totalRewards) -
        parseFloat(client_wallet.totalWithdraw);
      const update = await client_wallet.save();
      if (!update) {
        throw new Error('wallet update failed!');
      } else {
        //
      }
    } else {
      throw new Error('wallet not found!');
    }
  } catch (error) {
    throw new Error(error);
  }
};

// sum client assigned hotspots reward total and pass the value
const calHotspotTotal = async (assigned_hotspots) => {
  try {
    const responses = await Promise.all(
      assigned_hotspots?.map(async (data) => {
        const minTime = moment(data?.startDate).format('YYYY-MM-DD');
        const maxTime = moment(data?.endDate).format('YYYY-MM-DD');
        const url = `https://api.helium.io/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=${maxTime}&min_time=${minTime}`;
        const response = await axios.get(url);
        if (response?.data) {
          const val = (response?.data?.data?.total * data?.percentage) / 100;
          data.total_earned = val;
          await data.save();
          return response;
        } else {
          throw new Error('Helium API Failed, Try again later...');
        }
      })
    );

    if (responses.length > 0) {
      const clientHotspotsTotal = responses?.map((response, i) => {
        return {
          total:
            (response?.data?.data?.total * assigned_hotspots[i]?.percentage) /
            100,
        };
      });
      return clientHotspotsTotal;
    } else {
      throw new Error('API Falied');
    }
  } catch (error) {
    throw new Error('Helium API Failed, Try again later...');
  }
};
// get hotspot reward for multiple clients
const getHotspotReward = async (clients_list) => {
  try {
    const results = await Promise.all(
      clients_list?.map(async (clientId) => {
        const client_assigned_hotspot = await ClientHotspot.find({
          client_id: clientId,
        });
        const clientHotspotsTotal = await calHotspotTotal(
          client_assigned_hotspot
        );

        if (clientHotspotsTotal) {
          const total = clientHotspotsTotal
            ?.map((data) => data.total)
            .reduce((acc, curr) => {
              return acc + curr;
            }, 0);
          const totalEarn = total.toFixed(2);
          await updateWalletBalance(clientId, totalEarn, false);
          return true;
        } else {
          throw new Error('API Failed!');
        }
      })
    );
    const status = results.map((data) => (data === false ? false : true));
    return status;
  } catch (error) {
    throw new Error(error);
  }
};
// desc: fetch all clients reward by admin
// endpoint: host_url/api/admin/getRewardsByAdmin
// access: private
// method: put
const getHotspotRewardByAdmin = asyncHandler(async (req, res) => {
  const clients = await ClientHotspot.find({});
  if (clients.length > 0) {
    const clients_list = [];

    clients.forEach((client) => {
      if (
        _.findIndex(
          clients_list,
          (data) => data.toString() === client.client_id.toString()
        ) < 0
      ) {
        clients_list.push(client?.client_id);
      }
    });
    const data = await getHotspotReward(clients_list);

    if (data) {
      const response1 = await axios.get(
        'https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/stats'
      );
      const response2 = await axios.get(
        'https://api.helium.io/v1/accounts/13RUgCB bhLM2jNnzUhY7VRTAgdTi4bUi1o1eW3wV81wquavju7p/stats'
      );
      const mw_b = response1?.data?.data?.last_day[0]?.balance * 0.00000001;
      const sw_b = response2?.data?.data?.last_day[0]?.balance * 0.00000001;
      const mwsw = await MwSwBalance.find({});
      mwsw[0].mw_balance = mw_b + sw_b;
      await mwsw[0].save();
      res.status(200).json({ message: 'Reward fetched!' });
    } else {
      res.status(500);
      throw new Error('Failed to load hotspot reward!');
    }
  } else {
    res.status(404);
    throw new Error('No hotspot found!');
  }
});
// desc: fetch all clients reward by server itself
// endpoint: host_url/api/admin/getRewardsByServer
// access: private
// method: put
const getHotspotRewardByS = asyncHandler(async (req, res) => {
  const clients = await ClientHotspot.find({});
  if (clients.length > 0) {
    const clients_list = [];

    clients.forEach((client) => {
      if (
        _.findIndex(
          clients_list,
          (data) => data.toString() === client.client_id.toString()
        ) < 0
      ) {
        clients_list.push(client?.client_id);
      }
    });
    const data = getHotspotReward(clients_list);
    if (data) {
      res.status(200).json({ message: 'Reward fetched!' });
    } else {
      res.status(500);
      throw new Error('Failed to load hotspot reward!');
    }
  } else {
    res.status(404);
    throw new Error('No hotspot found!');
  }
});
// desc: delete a assigned hotspot by admin
// endpoint: host_url/api/admin/deleteHotspot/:hotspotId
// access: private
// method: delete
const deleteHotspot = asyncHandler(async (req, res) => {
  const hotspotId = req.params.hotspotId;
  const clientId = req.params.clientId;
  const hotspot = await ClientHotspot.findById(hotspotId);
  if (hotspot) {
    const client = await Client.findById(clientId);
    client.total_hotspot = parseInt(client.total_hotspot) - 1;
    if ((await hotspot.remove()) && (await client.save())) {
      const client_hotspot = await ClientHotspot.find({
        client_id: clientId,
      });

      await updateWalletBalance(clientId, hotspot.total_earned, true);
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
      res.status(500);
      throw new Error('Error hotspot deleting!');
    }
  } else {
    res.status(404);
    throw new Error('Hotspot not found!');
  }
});
// desc: get all withdraw requests
// endpoint: host_url/api/admin/getWithdrawalRequests
// access: private
// method: get
const getWithdrawalRequests = asyncHandler(async (req, res) => {
  const wr = await WithdrawRequest.find({})
    .populate('wallet')
    .populate('client');
  if (wr) {
    res.status(200);
    res.json(wr);
  } else {
    res.status(404);
    throw new Error('No Withdrawal Request!');
  }
});
// desc: accept a withdraw request by admin
// endpoint: host_url/api/admin/withdrawalRequestAccept/:requestId/accept
// access: private
// method: put
const withdrawalRequestAccept = asyncHandler(async (req, res) => {
  const wreqId = req.params.wreqId;
  const withdraw_request = await WithdrawRequest.findById(wreqId)
    .populate('wallet')
    .populate('client');
  if (withdraw_request) {
    const client_wallet = await Wallet.findOne({
      client_id: withdraw_request?.client,
    });

    if (client_wallet) {
      // clear pending payment to 0
      client_wallet.pendingPayment = 0;
      await client_wallet.save();
    }

    const wHistory = await WithdrawHistory.findOne({
      wReqId: wreqId,
    });

    if (wHistory) {
      wHistory.status = 'Confirmed';
      await wHistory.save();
    }

    // seding email
    const client_user = withdraw_request?.client;
    const withdrawAmount = withdraw_request.amount;
    const email = client_user.email;

    // send email to client
    // await sendEmail(
    //   process.env.EMAIL,
    //   email,
    //   'Sharespot Portugal',
    //   '',
    //   htmlBodyClientEmail(
    //     client_user.firstname,
    //     client_user.lastname,
    //     withdrawAmount
    //   )
    // );

    // withdraw request remove
    await withdraw_request.remove();

    const withdrawRequests = await WithdrawRequest.find({})
      .populate('wallet')
      .populate('client');

    res.status(200).json(withdrawRequests);
  } else {
    res.status(404);
    throw new Error('Withdraw request not found!');
  }
});

// desc: reject a withdraw request by admin
// endpoint: host_url/api/admin/withdrawalRequestReject/:requestId/reject
// access: private
// method: put
const withdrawalRequestReject = asyncHandler(async (req, res) => {
  const wreqId = req.params.wreqId;
  const withdraw_request = await WithdrawRequest.findById(wreqId);
  if (withdraw_request) {
    // update client wallet
    const client_wallet = await Wallet.findOne({
      client_id: withdraw_request.client,
    });
    client_wallet.totalWithdraw =
      parseFloat(client_wallet.totalWithdraw) -
      parseFloat(withdraw_request.amount);
    client_wallet.wallet_balance =
      parseFloat(client_wallet.totalRewards) -
      parseFloat(client_wallet.totalWithdraw);
    client_wallet.pendingPayment = 0;

    await client_wallet.save();

    const wHistory = await WithdrawHistory.findOne({ wReqId: wreqId });
    if (wHistory) {
      wHistory.status = 'Rejected';
      await wHistory.save();
    }

    await withdraw_request.remove();

    const withdrawRequests = await WithdrawRequest.find({})
      .populate('wallet')
      .populate('client');
    res.status(200).json(withdrawRequests);
  } else {
    res.status(404);
    throw new Error('Withdraw request not found!');
  }
});
// calculate all clients wallet balance
const calc_cw_balances = async (arr) => {
  const wallet_balance = arr
    .map((data) => data.wallet_balance)
    .reduce((acc, curr) => {
      return parseFloat(acc) + parseFloat(curr);
    }, 0);
  const pending_wBalance = arr
    .map((data) => data.pendingPayment)
    .reduce((acc, curr) => {
      return parseFloat(acc) + parseFloat(curr);
    }, 0);
  return (await wallet_balance) + pending_wBalance;
};
// desc: get main and second wallet balances
// endpoint: host_url/api/admin/getMainSecondWallet
// access: private
// method: get
const getMainSecondWallet = asyncHandler(async (req, res) => {
  const client_wallets = await Wallet.find({});
  if (client_wallets) {
    const cw_balance = await calc_cw_balances(client_wallets);
    const mwsw = await MwSwBalance.find({});
    res.status(200).json({
      mw_balance: mwsw[0]?.mw_balance,
      cw_balance,
    });
  } else {
    res.status(500);
    throw new Error('Failed to fetch client wallet balances!');
  }
});
// desc: add manula withdraw
// endpoint: host_url/api/admin/addManualWithdraw/:clietnId
// access: private
// method: get
const addManualWithdraw = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId);
  if (client) {
    const { mw_amount } = req.body;
    const client_wallet = await Wallet.findOne({ client_id: clientId });
    if (parseFloat(mw_amount) > client_wallet?.totalRewards) {
      res.status(400);
      throw new Error(
        `Withdraw can not be greater then total rewrads! Current TR: ${client_wallet?.totalRewards}`
      );
    } else {
      client_wallet.totalWithdraw =
        parseFloat(client_wallet.totalWithdraw) + parseFloat(mw_amount);
      client_wallet.wallet_balance =
        parseFloat(client_wallet.totalRewards) -
        parseFloat(client_wallet.totalWithdraw);

      const update = await client_wallet.save();

      if (update) {
        const new_mw_history = await ManualWithdrawHistory.create({
          client_id: clientId,
          mw_amount: mw_amount,
        });
        if (new_mw_history) {
          const mw_histories = await ManualWithdrawHistory.find({
            client_id: clientId,
          }).populate('client_id');
          res.status(200).json(mw_histories);
        } else {
          res.status(500);
          throw new Error('Unable to add manual withdraw!');
        }
      } else {
        res.status(500);
        throw new Error('Unable to add manual withdraw!');
      }
    }
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});
// desc: get manual withdraw histories list
// endpoint: host_url/api/admin/getManulaWithdrawHistory/:clientId
// access: private
// method: get
const getManulaWithdrawHistory = asyncHandler(async (req, res) => {
  const mw_histories = await ManualWithdrawHistory.find({
    client_id: req.params.clientId,
  })
    .populate('client_id')
    .sort({ createdAt: '-1' });
  if (mw_histories) {
    res.status(200).json(mw_histories);
  } else {
    res.status(404);
    throw new Error('Not found!');
  }
});
// desc: delete a manual withdarw history
// endpoint: host_url/api/admin/deleteManualWithdraw/:historyId
// access: private
// method: delete
const deleteManualWithdraw = asyncHandler(async (req, res) => {
  const history = await ManualWithdrawHistory.findById(req.params.historyId);
  if (history) {
    const client_wallet = await Wallet.findOne({
      client_id: history.client_id,
    });
    client_wallet.totalWithdraw =
      parseFloat(client_wallet.totalWithdraw) - parseFloat(history.mw_amount);
    client_wallet.wallet_balance =
      parseFloat(client_wallet.totalRewards) -
      parseFloat(client_wallet.totalWithdraw);
    const update = await client_wallet.save();
    if (update) {
      const delation = await history.remove();
      if (delation) {
        const mw_histories = await ManualWithdrawHistory.find({
          client_id: history.client_id,
        }).populate('client_id');
        res.status(200).json(mw_histories);
      } else {
        res.status(500);
        throw new Error('History delation error!');
      }
    } else {
      res.status(500);
      throw new Error('Wallet update error!');
    }
  } else {
    res.status(404);
    throw new Error('History not found!');
  }
});
// push manual withdraw histories to system withdraw histories
const PushMWHistory = async (histories, mwhistories) => {
  const mh = mwhistories.map((data) => {
    const newObj = {
      client: data?.client_id,
      amount: data?.mw_amount,
      status: 'Manual',
      wReqId: 'null',
      createdAt: data?.createdAt,
    };
    return newObj;
  });
  const newHis = [...histories, ...mh];
  return newHis;
};
// desc: get withdraw histories for a single client
// endpoint: host_url/api/admin/getManulaWithdrawHistory/:clientId
// access: private
// method: get
const getWithdrawHistoryByAdmin = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client_user = await Client.findById(clientId);
  if (client_user) {
    const w_reqs = await WithdrawHistory.find({ client: clientId }).sort({
      createdAt: '-1',
    });
    if (w_reqs) {
      const mw_histories = await ManualWithdrawHistory.find({
        client_id: clientId,
      });
      if (mw_histories.length > 0) {
        const newH = await PushMWHistory(w_reqs, mw_histories);
        res.status(200);
        res.json(newH);
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
// desc: get agreements of specific hotspot
// endpoint: host_url/api/admin/getHotspotAgreements/:hotspotId
// access: private
// method: get
const getHotspotAgreements = asyncHandler(async (req, res) => {
  const hotspotId = req.params.hotspotId;
  const agreements = await ClientHotspot.find({
    hotspot_address: hotspotId,
  }).populate('client_id');
  if (agreements) {
    res.status(200).json(agreements);
  } else {
    res.status(404);
    throw new Error('No agreements found for this hotspot!');
  }
});
// desc: admin multiple withdraw requests at once
// endpoint: host_url/api/admin/acceptMultipleWithdrawRequests
// access: private
// method: post
const acceptMultipleWithdrawRequests = asyncHandler(async (req, res) => {
  const { requestIds } = req.body;

  for (const requestId of requestIds) {
    const withdraw_request = await WithdrawRequest.findById(requestId)
      .populate('wallet')
      .populate('client');

    if (withdraw_request) {
      const client_wallet = await Wallet.findOne({
        client_id: withdraw_request.client._id,
      });

      if (client_wallet) {
        // clear pending payment to 0
        client_wallet.pendingPayment = 0;
        await client_wallet.save();
      }

      // withdraw process start
      const wHistory = await WithdrawHistory.findOne({
        wReqId: requestId,
      });

      // finding withdraw history & update
      if (wHistory) {
        wHistory.status = 'Confirmed';
        await wHistory.save();
      }
      await withdraw_request.remove();
    }
  }
  const withdrawRequests = await WithdrawRequest.find({})
    .populate('wallet')
    .populate('client');
  res.status(200).json(withdrawRequests);
});

export {
  adminLogin,
  addClient,
  addHotspotToClient,
  getHotspotReward,
  getAllClients,
  getClientsHotspot,
  getSingleClientHotspots,
  editSingleClient,
  editHotspotToClient,
  deleteClient,
  deleteHotspot,
  updateWalletBalance,
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
  getHotspotAgreements,
  acceptMultipleWithdrawRequests,
};
