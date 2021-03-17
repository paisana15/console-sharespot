import asyncHandler from 'express-async-handler';
import Client from '../models/ClientModel.js';
import ClientHotspot from '../models/ClientHotspotModel.js';
import { generateToken } from '../utils/generateToken.js';
import Wallet from '../models/WalletModel.js';
import axios from 'axios';
import moment from 'moment';

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
// desc: get all client list with name
// routes: api/clients/getAllClients
// access: public
// method: get
const getAllClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({}).select('-password');
  if (clients) {
    res.status(200).json(clients);
  } else {
    res.status(400);
    throw new Error('Client fethch failed!');
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
// desc: get hotspot reward
// routes: api/clients/getRewards
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
  addClient,
  clientLogin,
  addHotspotToClient,
  getHotspotReward,
  getAllClients,
};
