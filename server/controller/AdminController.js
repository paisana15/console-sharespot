import asyncHandler from 'express-async-handler';
import Admin from '../models/AdminModel.js';
import Client from '../models/ClientModel.js';
import ClientHotspot from '../models/ClientHotspotModel.js';
import Wallet from '../models/WalletModel.js';
import { generateToken } from '../utils/generateToken.js';
import axios from 'axios';
import moment from 'moment';
import WithdrawRequest from '../models/WithdrawRequestModel.js';
import { WalletClient } from 'proto';
import WithdrawHistory from '../models/WithdrawHistoryModel.js';
import ManualWithdrawHistory from '../models/ManualWithdrawHistoryModel.js';

// // creating client
const target = '139.59.164.172:8888'; // public Ip, we will change it for a local private address later
const client = new WalletClient(target);

// desc: admin login
// routes: api/admin/login
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
// routes: api/admin/addNewClient
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
      const client = await Client.findById({ _id: newClient._id }).select(
        '-password'
      );
      res.status(200).json(client);
    } else {
      res.status(500);
      throw new Error('Client registration failed!');
    }
  }
});
// desc: admin delete a client
// routes: api/admin/deleteClient/:clientId
// access: private
// method: del
const deleteClient = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId);
  if (client) {
    const del = await client.remove();
    const clientHotspots = await ClientHotspot.find({ client_id: client._id });
    const clientWallets = await Wallet.findOne({ client_id: client._id });
    if (clientHotspots !== null) {
      await ClientHotspot.deleteMany(
        { client_id: clientId },
        (error, result) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
    if (clientWallets) {
      await Wallet.deleteOne({ client_id: client._id });
    }
    if (del) {
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
// desc: get all client list with name
// routes: api/admin/getAllClients
// access: public
// method: get
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({}).select('-password');
  if (clients) {
    res.status(200).json(clients);
  } else {
    res.status(404);
    throw new Error('Client fethch failed!');
  }
});
// desc: admin add hotspot to client
// routes: api/admin/addHotspotToClient
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
    if (client_has_current_hostpot.length > 0) {
      res.status(400);
      throw new Error(`This hotspot is already assigned to this client!`);
    } else {
      const h_name = req.body.hotspot_address.split(' ')[0];
      const h_address = req.body.hotspot_address.split(' ')[1];

      if (relation_type === 'host') {
        const hotspot_has_host = await ClientHotspot.find({
          hotspot_address: h_address,
          relation_type: 'host',
        });
        if (hotspot_has_host.length > 0) {
          res.status(400);
          throw new Error(
            "This hotspot already assigned as host, can't be assign!"
          );
        } else {
          const newConnection = await ClientHotspot.create({
            hotspot_name: h_name,
            hotspot_address: h_address,
            client_id: req.body.client_id,
            relation_type: req.body.relation_type,
            percentage: req.body.percentage,
            startDate: req.body.startDate,
          });
          if (newConnection) {
            client.total_hotspot = parseInt(client.total_hotspot) + 1;
            await client.save();
            const client_has_wallet = await Wallet.findOne({
              client_id: client_id,
            });
            if (client_has_wallet === null) {
              await Wallet.create({
                client_id: client_id,
                totalRewards: 0.0,
                totalWithdraw: 0.0,
                wallet_balance: 0.0,
              });
            }
            res.status(200).json(newConnection);
          } else {
            throw new Error();
          }
        }
      } else {
        const newConnection = await ClientHotspot.create({
          hotspot_name: h_name,
          hotspot_address: h_address,
          client_id: req.body.client_id,
          relation_type: req.body.relation_type,
          percentage: req.body.percentage,
          startDate: req.body.startDate,
        });
        if (newConnection) {
          client.total_hotspot = parseInt(client.total_hotspot) + 1;
          await client.save();
          const client_has_wallet = await Wallet.findOne({
            client_id: client_id,
          });
          if (client_has_wallet === null) {
            await Wallet.create({
              client_id: client_id,
              totalRewards: 0.0,
              totalWithdraw: 0.0,
              wallet_balance: 0.0,
            });
          }
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
// desc: admin edit client hotspot
// routes: api/admin/addHotspotToClient
// access: private
// method: post
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
// routes: api/admin/getClientsHotspot
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
// routes: api/admin/getSingleClient/:clientId
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
// routes: api/admin/editClientProfile/:clientId
// access: private
// method: get
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
// desc: get hotspot reward
// routes: api/admin/getRewards
// access: private
// method: put
// const getHotspotReward = (req, res) => {
//   let clientHotspots = [];
//   ClientHotspot.find({
//     client_id: req.params.clientId,
//   })
//     .then((client_assigned_hotspot) =>
//       client_assigned_hotspot.map((data) => {
//         axios
//           .get(
//             `https://api.helium.io/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=2030-08-27&min_time=2019-01-01`
//           )
//           .then((res) => {
//             if (res?.data) {
//               clientHotspots.push(res?.data?.data);
//             }
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       })
//     )
//     .then((clientHotspots) => {
//       clientHotspots
//         .map((data) => data?.total)
//         .reduce((acc, curr) => {
//           return acc + curr;
//         }, 0);
//     })
//     .then((total) => {
//       const totalEarn = (total * 10) / 100;
//       console.log(totalEarn);
//       res.status(200).json(clientHotspots);
//     })
//     .catch((err) => console.log(err));
// };
const updateWalletBalance = async (clientId, balance, deleteHotspot) => {
  try {
    const client_wallet = await Wallet.findOne({ client_id: clientId });
    if (client_wallet) {
      // console.log(client_wallet.totalRewards + ', ' + 'new reward ' + balance);

      if (deleteHotspot) {
        client_wallet.totalRewards =
          parseFloat(client_wallet.totalRewards) -
          parseFloat(balance?.toFixed(2));
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
        // console.log('wallet update!');
      }
    } else {
      throw new Error('wallet not found!');
    }
  } catch (error) {
    console.log(error);
  }
};

const getHotspotReward = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;
  const client = await Client.findById(clientId);
  if (client) {
    let clientHotspots = [];
    const client_assigned_hotspot = await ClientHotspot.find({
      client_id: clientId,
    });

    client_assigned_hotspot.map((data) => {
      const minDate = moment(data?.startDate).format('YYYY-MM-DD');
      axios
        .get(
          `https://api.helium.io/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=2030-08-27&min_time=${minDate}`
        )
        .then((res) => {
          if (res?.data) {
            const val = (res?.data?.data?.total * data?.percentage) / 100;
            clientHotspots.push({
              total: val,
            });
            data.total_earned = val;
            data.save();
          } else {
            throw new Error('Failed to fetch data!');
          }
        })
        .catch((error) => {
          console.log(error);
        });
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
        res.status(500);
        throw new Error();
      }
    }, 5000);
  } else {
    res.status(404);
    throw new Error('Client not found!');
  }
});
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
const withdrawalRequestAccept = asyncHandler(async (req, res) => {
  const wreqId = req.params.wreqId;
  const withdraw_request = await WithdrawRequest.findById(wreqId)
    .populate('wallet')
    .populate('client');
  if (withdraw_request) {
    const client_user = withdraw_request?.client;
    const client_wallet = await Wallet.findById(withdraw_request?.wallet);

    // withdraw process start
    // send payout sample
    let payoutResponse = await client.sendPayout(
      `${client_user?.wallet_address}`,
      withdraw_request?.amount * 1000000000
    );
    if (payoutResponse) {
      const transaction = payoutResponse.getTransactionhash();
      // if transaction successfull

      // creating withdraw history
      const wHistory = await WithdrawHistory.create({
        client: client_user,
        amount: withdraw_request.amount,
        transaction: transaction,
      });

      // clear pending payment to 0
      client_wallet.pendingPayment = 0;
      // update client wallet balance on db
      client_wallet.totalWithdraw =
        parseFloat(client_wallet.totalWithdraw) +
        parseFloat(withdraw_request.amount);
      client_wallet.wallet_balance =
        parseFloat(client_wallet.totalRewards) -
        parseFloat(client_wallet.totalWithdraw);
      const cWallet = await client_wallet.save();

      // withdraw request
      const rmWh = await withdraw_request.remove();

      if (wHistory && cWallet && rmWh) {
        const wr = await WithdrawRequest.find({})
          .populate('wallet')
          .populate('client');
        res.status(200);
        res.json(wr);
      } else {
        res.status(500);
        throw new Error('Failed to create withdraw history!');
      }
    } else {
      if (payoutResponse.error.code === 7) {
        res.status(500);
        throw new Error('Wallet locked');
      } else if (payoutResponse.error.code === 8) {
        res.status(500);
        throw new Error('Balance too low');
      }
    }
  } else {
    res.status(404);
    throw new Error('Withdraw request not found!');
  }
});
// const withdrawalRequestAccept = (req, res) => {
//   const wreqId = req.params.wreqId;
//   WithdrawRequest.findById(wreqId)
//     .populate('wallet')
//     .populate('client')
//     .then((withdraw_request) => {
//       Wallet.findById(withdraw_request?.wallet)
//         .then((client_wallet) => {
//           const client_user = withdraw_request?.client;
//           return { client_user, client_wallet };
//         })
//         .then(({ client_user, client_wallet }) => {
//           client.sendPayout(
//             `13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp`,
//             withdraw_request?.amount * 1000000000,
//             (err, payoutResponse) => {
//               if (err) {
//                 if (err.code === 7) {
//                   res.status(500);
//                   throw new Error('wallet is locked');
//                 } else if (err.code === 8) {
//                   res.status(500);
//                   throw new Error('low balance', err.details);
//                 } else {
//                   throw new Error();
//                 }
//               } else {
//                 const transaction = payoutResponse.getTransactionhash();
//                 return transaction;
//               }
//             }
//           );
//           return { client_user, client_wallet, transaction };
//         })
//         .then(({ client_user, client_wallet, transaction }) => {
//           console.log(client_user, client_wallet);
//         })
//         .catch((error) => {
//           throw new Error(error);
//         });
//     })
//     .catch((error) => {
//       throw new Error(error);
//     });
// };

const withdrawalRequestReject = asyncHandler(async (req, res) => {
  const wreqId = req.params.wreqId;
  const withdraw_request = await WithdrawRequest.findById(wreqId);
  if (withdraw_request) {
    const client_wallet = await Wallet.findById(withdraw_request.wallet);
    console.log(client_wallet);
    client_wallet.pendingPayment = 0;
    const cw = await client_wallet.save();
    const rwr = await withdraw_request.remove();

    if (cw && rwr) {
      const wr = await WithdrawRequest.find({})
        .populate('wallet')
        .populate('client');
      res.status(200);
      res.json(wr);
    } else {
      res.status(500);
      throw new Error();
    }
  } else {
    res.status(404);
    throw new Error('Withdraw request not found!');
  }
});
const getMainSecondWallet = (req, res) => {
  const request1 = axios.get(
    'https://api.helium.io/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/stats'
  );
  const request2 = axios.get(
    'https://api.helium.io/v1/accounts/13RUgCBbhLM2jNnzUhY7VRTAgdTi4bUi1o1eW3wV81wquavju7p/stats'
  );
  axios
    .all([request1, request2])
    .then(
      axios.spread((...responses) => {
        if (responses) {
          const mw_balance =
            responses[0]?.data?.data?.last_day[0]?.balance * 0.00000001;
          const sw_balance =
            responses[1]?.data?.data?.last_day[0]?.balance * 0.00000001;
          return { mw_balance, sw_balance };
        } else {
          throw new Error('Network Error!');
        }
      })
    )
    .then(({ mw_balance, sw_balance }) => {
      Wallet.find({}).then((wallets) => {
        const cw_balance = wallets.reduce(
          (acc, curr) =>
            parseFloat(acc?.wallet_balance) + parseFloat(curr?.wallet_balance)
        );
        res.status(200).json({ mw_balance, sw_balance, cw_balance });
      });
    })
    .catch((errors) => {
      throw new Error(errors);
    });
};
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
          const mw_histories = await ManualWithdrawHistory.find({}).populate(
            'client_id'
          );
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

const getManulaWithdrawHistory = asyncHandler(async (req, res) => {
  const mw_histories = await ManualWithdrawHistory.find({
    client_id: req.params.clientId,
  }).populate('client_id');
  if (mw_histories) {
    res.status(200).json(mw_histories);
  } else {
    res.status(404);
    throw new Error('Not found!');
  }
});

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
        const mw_histories = await ManualWithdrawHistory.find({}).populate(
          'client_id'
        );
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
};
