import asyncHandler from 'express-async-handler';
import Admin from '../models/AdminModel.js';
import Client from '../models/ClientModel.js';
import ClientHotspot from '../models/ClientHotspotModel.js';
import Wallet from '../models/WalletModel.js';
import { generateToken } from '../utils/generateToken.js';
import axios from 'axios';
import moment from 'moment';

// desc: admin login
// routes: api/admin/login
// access: private
// method: post
const adminLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  console.log(admin);
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
    hotspot_address: hotspot_address,
  });
  if (client) {
    if (client_has_current_hostpot.length > 0) {
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
        const newConnection = await ClientHotspot.create(req.body);
        if (newConnection) {
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
  const client = await ClientHotspot.find({ client_id: clientId }).populate(
    'client_id'
  );
  if (client) {
    const clientWallet = await Wallet.findOne({ client_id: clientId });
    if (clientWallet) {
      res.status(200).json({ client, clientWallet });
    } else {
      res.status(404);
      throw new Error('Wallet not found!');
    }
  } else {
    res.status(404);
    throw new Error('No hotspot assigned to this client!');
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
const updateWalletBalance = async (client_id, balance) => {
  try {
    const client_wallet = await Wallet.findOne({ client_id: client_id });
    if (client_wallet) {
      console.log(
        client_wallet.totalRewards +
          ', ' +
          'new reward ' +
          balance +
          ', prev reward ' +
          client_wallet.previousReward
      );

      client_wallet.totalRewards = parseFloat(balance);

      client_wallet.wallet_balance =
        parseFloat(client_wallet.totalRewards) -
        parseFloat(client_wallet.totalWithdraw);
      const update = await client_wallet.save();
      if (!update) {
        throw new Error('wallet update failed!');
      } else {
        console.log('wallet update!');
      }
    } else {
      throw new Error('wallet not found!');
    }
  } catch (error) {
    console.log(error);
  }
};
const getHotspotReward = asyncHandler(async (req, res) => {
  const client_id = req.params.clientId;
  let clientHotspots = [];
  const client_assigned_hotspot = await ClientHotspot.find({
    client_id: client_id,
  });

  client_assigned_hotspot.map((data) => {
    const minDate = moment(data?.startDate).format('YYYY-MM-DD');
    console.log(minDate);
    axios
      .get(
        `https://api.helium.io/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=2030-08-27&min_time=${minDate}`
      )
      .then((res) => {
        if (res?.data) {
          clientHotspots.push({
            total: (res?.data?.data?.total * data?.percentage) / 100,
          });
        } else {
          throw new Error('Failed to fetch data!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
  setTimeout(() => {
    const total = clientHotspots
      .map((data) => data.total)
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    const totalEarn = total.toFixed(2);
    updateWalletBalance(client_id, totalEarn);
  }, 5000);
});
// const getHotspotReward = (req, res) => {
//   const client_id = req.params.clientId;
//   let clientHotspots = [];
//   ClientHotspot.find({
//     client_id: client_id,
//   })
//     .then((client_assigned_hotspot) => {
//       client_assigned_hotspot.map((data) => {
//         const minDate = moment(data?.startDate).format('YYYY-MM-DD');
//         axios
//           .get(
//             `https://api.helium.io/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=2030-08-27&min_time=${minDate}`
//           )
//           .then((res) => {
//             if (res?.data) {
//               clientHotspots.push({
//                 total: (res?.data?.data?.total * data?.percentage) / 100,
//               });
//               return clientHotspots;
//             } else {
//               throw new Error('Failed to fetch data!');
//             }
//           })
//           .then((clientHotspots) => {
//             console.log(clientHotspots);
//             const total = clientHotspots
//               .map((data) => data.total)
//               .reduce((acc, curr) => {
//                 return acc + curr;
//               }, 0);
//             const totalEarn = total.toFixed(2);
//             updateWalletBalance(client_id, totalEarn);

//             res.status(200).json({ message: 'Hotspot reward updated!' });
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export {
  adminLogin,
  addClient,
  addHotspotToClient,
  getHotspotReward,
  getAllClients,
  getClientsHotspot,
  getSingleClientHotspots,
  editSingleClient,
};
