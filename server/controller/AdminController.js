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
    }
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
        const url = `https://api.helium.wtf/v1/hotspots/${data?.hotspot_address}/rewards/sum?max_time=${maxTime}&min_time=${minTime}`;
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
        'https://api.helium.wtf/v1/accounts/13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp/stats'
      );
      const response2 = await axios.get(
        'https://api.helium.wtf/v1/accounts/13RUgCB bhLM2jNnzUhY7VRTAgdTi4bUi1o1eW3wV81wquavju7p/stats'
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
    const client_user = withdraw_request?.client;
    const client_wallet = await Wallet.findOne({
      client_id: withdraw_request?.client,
    });

    // withdraw process start
    // finding withdraw hsitory
    const wHistory = await WithdrawHistory.findOne({
      wReqId: wreqId,
    });

    if (wHistory) {
      // clear pending payment to 0
      client_wallet.pendingPayment = 0;
      const cWallet = await client_wallet.save();

      // withdraw request value
      const wa = withdraw_request.amount;
      // remove withdraw request
      const rmWh = await withdraw_request.remove();
      wHistory.status = 'Confirmed';
      const updatewHistory = await wHistory.save();

      if (updatewHistory && cWallet && rmWh) {
        // seding email
        const email = client_user.email;

        const valid_email = emailValidator.validate(email);

        if (valid_email) {
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL, // your email
              pass: process.env.PASSE, // email pass
            },
          });

          const emailSent = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Sharespot Portugal',
            text: '',
            html: `
            <!doctype html>
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <!-- NAME: 1 COLUMN -->
                    <!--[if gte mso 15]>
                    <xml>
                        <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch></o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Recebeu um pagamento de Sharespot Portugal</title>
                    
                <style type="text/css">
                p{
                  margin:10px 0;
                  padding:0;
                }
                table{
                  border-collapse:collapse;
                }
                h1,h2,h3,h4,h5,h6{
                  display:block;
                  margin:0;
                  padding:0;
                }
                img,a img{
                  border:0;
                  height:auto;
                  outline:none;
                  text-decoration:none;
                }
                body,#bodyTable,#bodyCell{
                  height:100%;
                  margin:0;
                  padding:0;
                  width:100%;
                }
                .mcnPreviewText{
                  display:none !important;
                }
                #outlook a{
                  padding:0;
                }
                img{
                  -ms-interpolation-mode:bicubic;
                }
                table{
                  mso-table-lspace:0pt;
                  mso-table-rspace:0pt;
                }
                .ReadMsgBody{
                  width:100%;
                }
                .ExternalClass{
                  width:100%;
                }
                p,a,li,td,blockquote{
                  mso-line-height-rule:exactly;
                }
                a[href^=tel],a[href^=sms]{
                  color:inherit;
                  cursor:default;
                  text-decoration:none;
                }
                p,a,li,td,body,table,blockquote{
                  -ms-text-size-adjust:100%;
                  -webkit-text-size-adjust:100%;
                }
                .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
                  line-height:100%;
                }
                a[x-apple-data-detectors]{
                  color:inherit !important;
                  text-decoration:none !important;
                  font-size:inherit !important;
                  font-family:inherit !important;
                  font-weight:inherit !important;
                  line-height:inherit !important;
                }
                #bodyCell{
                  padding:10px;
                  border-top:0;
                }
                .templateContainer{
                  max-width:600px !important;
                }
                a.mcnButton{
                  display:block;
                }
                .mcnImage,.mcnRetinaImage{
                  vertical-align:bottom;
                }
                .mcnTextContent{
                  word-break:break-word;
                }
                .mcnTextContent img{
                  height:auto !important;
                }
                .mcnDividerBlock{
                  table-layout:fixed !important;
                }
              /*
              @tab Page
              @section Background Style
              @tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.
              */
                body,#bodyTable{
                  /*@editable*/background-color:#161627;
                }
              /*
              @tab Page
              @section Background Style
              @tip Set the background color and top border for your email. You may want to choose colors that match your company's branding.
              */
                #bodyCell{
                  /*@editable*/border-top:0;
                }
              /*
              @tab Page
              @section Email Border
              @tip Set the border for your email.
              */
                .templateContainer{
                  /*@editable*/border:0;
                }
              /*
              @tab Page
              @section Heading 1
              @tip Set the styling for all first-level headings in your emails. These should be the largest of your headings.
              @style heading 1
              */
                h1{
                  /*@editable*/color:#ffffff;
                  /*@editable*/font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  /*@editable*/font-size:26px;
                  /*@editable*/font-style:normal;
                  /*@editable*/font-weight:bold;
                  /*@editable*/line-height:125%;
                  /*@editable*/letter-spacing:normal;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Page
              @section Heading 2
              @tip Set the styling for all second-level headings in your emails.
              @style heading 2
              */
                h2{
                  /*@editable*/color:#202020;
                  /*@editable*/font-family:Helvetica;
                  /*@editable*/font-size:22px;
                  /*@editable*/font-style:normal;
                  /*@editable*/font-weight:bold;
                  /*@editable*/line-height:125%;
                  /*@editable*/letter-spacing:normal;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Page
              @section Heading 3
              @tip Set the styling for all third-level headings in your emails.
              @style heading 3
              */
                h3{
                  /*@editable*/color:#202020;
                  /*@editable*/font-family:Helvetica;
                  /*@editable*/font-size:20px;
                  /*@editable*/font-style:normal;
                  /*@editable*/font-weight:bold;
                  /*@editable*/line-height:125%;
                  /*@editable*/letter-spacing:normal;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Page
              @section Heading 4
              @tip Set the styling for all fourth-level headings in your emails. These should be the smallest of your headings.
              @style heading 4
              */
                h4{
                  /*@editable*/color:#202020;
                  /*@editable*/font-family:Helvetica;
                  /*@editable*/font-size:18px;
                  /*@editable*/font-style:normal;
                  /*@editable*/font-weight:bold;
                  /*@editable*/line-height:125%;
                  /*@editable*/letter-spacing:normal;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Preheader
              @section Preheader Style
              @tip Set the background color and borders for your email's preheader area.
              */
                #templatePreheader{
                  /*@editable*/background-color:#44bba4;
                  /*@editable*/background-image:none;
                  /*@editable*/background-repeat:no-repeat;
                  /*@editable*/background-position:center;
                  /*@editable*/background-size:cover;
                  /*@editable*/border-top:0;
                  /*@editable*/border-bottom:0;
                  /*@editable*/padding-top:9px;
                  /*@editable*/padding-bottom:9px;
                }
              /*
              @tab Preheader
              @section Preheader Text
              @tip Set the styling for your email's preheader text. Choose a size and color that is easy to read.
              */
                #templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{
                  /*@editable*/color:#ffffff;
                  /*@editable*/font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  /*@editable*/font-size:11px;
                  /*@editable*/line-height:150%;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Preheader
              @section Preheader Link
              @tip Set the styling for your email's preheader links. Choose a color that helps them stand out from your text.
              */
                #templatePreheader .mcnTextContent a,#templatePreheader .mcnTextContent p a{
                  /*@editable*/color:#ffffff;
                  /*@editable*/font-weight:normal;
                  /*@editable*/text-decoration:underline;
                }
              /*
              @tab Header
              @section Header Style
              @tip Set the background color and borders for your email's header area.
              */
                #templateHeader{
                  /*@editable*/background-color:#0e0c1c;
                  /*@editable*/background-image:none;
                  /*@editable*/background-repeat:no-repeat;
                  /*@editable*/background-position:center;
                  /*@editable*/background-size:cover;
                  /*@editable*/border-top:0;
                  /*@editable*/border-bottom:0;
                  /*@editable*/padding-top:9px;
                  /*@editable*/padding-bottom:20px;
                }
              /*
              @tab Header
              @section Header Text
              @tip Set the styling for your email's header text. Choose a size and color that is easy to read.
              */
                #templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{
                  /*@editable*/color:#202020;
                  /*@editable*/font-family:Helvetica;
                  /*@editable*/font-size:16px;
                  /*@editable*/line-height:150%;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Header
              @section Header Link
              @tip Set the styling for your email's header links. Choose a color that helps them stand out from your text.
              */
                #templateHeader .mcnTextContent a,#templateHeader .mcnTextContent p a{
                  /*@editable*/color:#007C89;
                  /*@editable*/font-weight:normal;
                  /*@editable*/text-decoration:underline;
                }
              /*
              @tab Body
              @section Body Style
              @tip Set the background color and borders for your email's body area.
              */
                #templateBody{
                  /*@editable*/background-color:#01111a;
                  /*@editable*/background-image:none;
                  /*@editable*/background-repeat:no-repeat;
                  /*@editable*/background-position:center;
                  /*@editable*/background-size:cover;
                  /*@editable*/border-top:0;
                  /*@editable*/border-bottom:1px solid #EAEAEA;
                  /*@editable*/padding-top:0px;
                  /*@editable*/padding-bottom:15px;
                }
              /*
              @tab Body
              @section Body Text
              @tip Set the styling for your email's body text. Choose a size and color that is easy to read.
              */
                #templateBody .mcnTextContent,#templateBody .mcnTextContent p{
                  /*@editable*/color:#ffffff;
                  /*@editable*/font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  /*@editable*/font-size:16px;
                  /*@editable*/line-height:150%;
                  /*@editable*/text-align:left;
                }
              /*
              @tab Body
              @section Body Link
              @tip Set the styling for your email's body links. Choose a color that helps them stand out from your text.
              */
                #templateBody .mcnTextContent a,#templateBody .mcnTextContent p a{
                  /*@editable*/color:#44bba4;
                  /*@editable*/font-weight:normal;
                  /*@editable*/text-decoration:none;
                }
              /*
              @tab Footer
              @section Footer Style
              @tip Set the background color and borders for your email's footer area.
              */
                #templateFooter{
                  /*@editable*/background-color:#0e0c1c;
                  /*@editable*/background-image:none;
                  /*@editable*/background-repeat:no-repeat;
                  /*@editable*/background-position:center;
                  /*@editable*/background-size:cover;
                  /*@editable*/border-top:0;
                  /*@editable*/border-bottom:0;
                  /*@editable*/padding-top:9px;
                  /*@editable*/padding-bottom:9px;
                }
              /*
              @tab Footer
              @section Footer Text
              @tip Set the styling for your email's footer text. Choose a size and color that is easy to read.
              */
                #templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{
                  /*@editable*/color:#adacac;
                  /*@editable*/font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  /*@editable*/font-size:12px;
                  /*@editable*/line-height:150%;
                  /*@editable*/text-align:center;
                }
              /*
              @tab Footer
              @section Footer Link
              @tip Set the styling for your email's footer links. Choose a color that helps them stand out from your text.
              */
                #templateFooter .mcnTextContent a,#templateFooter .mcnTextContent p a{
                  /*@editable*/color:#adacac;
                  /*@editable*/font-weight:normal;
                  /*@editable*/text-decoration:underline;
                }
              @media only screen and (min-width:768px){
                .templateContainer{
                  width:600px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                body,table,td,p,a,li,blockquote{
                  -webkit-text-size-adjust:none !important;
                }
            
            }	@media only screen and (max-width: 480px){
                body{
                  width:100% !important;
                  min-width:100% !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnRetinaImage{
                  max-width:100% !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImage{
                  width:100% !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
                  max-width:100% !important;
                  width:100% !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnBoxedTextContentContainer{
                  min-width:100% !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImageGroupContent{
                  padding:9px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
                  padding-top:9px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
                  padding-top:18px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImageCardBottomImageContent{
                  padding-bottom:9px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImageGroupBlockInner{
                  padding-top:0 !important;
                  padding-bottom:0 !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImageGroupBlockOuter{
                  padding-top:9px !important;
                  padding-bottom:9px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnTextContent,.mcnBoxedTextContentColumn{
                  padding-right:18px !important;
                  padding-left:18px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
                  padding-right:18px !important;
                  padding-bottom:0 !important;
                  padding-left:18px !important;
                }
            
            }	@media only screen and (max-width: 480px){
                .mcpreview-image-uploader{
                  display:none !important;
                  width:100% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Heading 1
              @tip Make the first-level headings larger in size for better readability on small screens.
              */
                h1{
                  /*@editable*/font-size:22px !important;
                  /*@editable*/line-height:125% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Heading 2
              @tip Make the second-level headings larger in size for better readability on small screens.
              */
                h2{
                  /*@editable*/font-size:20px !important;
                  /*@editable*/line-height:125% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Heading 3
              @tip Make the third-level headings larger in size for better readability on small screens.
              */
                h3{
                  /*@editable*/font-size:18px !important;
                  /*@editable*/line-height:125% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Heading 4
              @tip Make the fourth-level headings larger in size for better readability on small screens.
              */
                h4{
                  /*@editable*/font-size:16px !important;
                  /*@editable*/line-height:150% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Boxed Text
              @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
              */
                .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
                  /*@editable*/font-size:14px !important;
                  /*@editable*/line-height:150% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Preheader Visibility
              @tip Set the visibility of the email's preheader on small screens. You can hide it to save space.
              */
                #templatePreheader{
                  /*@editable*/display:block !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Preheader Text
              @tip Make the preheader text larger in size for better readability on small screens.
              */
                #templatePreheader .mcnTextContent,#templatePreheader .mcnTextContent p{
                  /*@editable*/font-size:14px !important;
                  /*@editable*/line-height:150% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Header Text
              @tip Make the header text larger in size for better readability on small screens.
              */
                #templateHeader .mcnTextContent,#templateHeader .mcnTextContent p{
                  /*@editable*/font-size:16px !important;
                  /*@editable*/line-height:150% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Body Text
              @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
              */
                #templateBody .mcnTextContent,#templateBody .mcnTextContent p{
                  /*@editable*/font-size:16px !important;
                  /*@editable*/line-height:150% !important;
                }
            
            }	@media only screen and (max-width: 480px){
              /*
              @tab Mobile Styles
              @section Footer Text
              @tip Make the footer content text larger in size for better readability on small screens.
              */
                #templateFooter .mcnTextContent,#templateFooter .mcnTextContent p{
                  /*@editable*/font-size:14px !important;
                  /*@editable*/line-height:150% !important;
                }
            
            }</style></head>
                <body>
                    <!--*|IF:MC_PREVIEW_TEXT|*-->
                    <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">Recebeu um pagamento da Sharespot!</span><!--<![endif]-->
                    <!--*|END:IF|*-->
                    <center>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                            <tr>
                                <td align="center" valign="top" id="bodyCell">
                                    <!-- BEGIN TEMPLATE // -->
                                    <!--[if (gte mso 9)|(IE)]>
                                    <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                    <tr>
                                    <td align="center" valign="top" width="600" style="width:600px;">
                                    <![endif]-->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                        <tr>
                                            <td valign="top" id="templatePreheader"></td>
                                        </tr>
                                        <tr>
                                            <td valign="top" id="templateHeader"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">
                <tbody class="mcnImageBlockOuter">
                        <tr>
                            <td valign="top" style="padding:0px" class="mcnImageBlockInner">
                                <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">
                                    <tbody><tr>
                                        <td class="mcnImageContent" valign="top" style="padding-right: 0px; padding-left: 0px; padding-top: 0; padding-bottom: 0; text-align:center;">
                                            
                                                
                                                    <img align="center" alt="" src="https://mcusercontent.com/bde0aa898251e2319a5e28036/images/0b76fbd1-e128-42a4-aad7-8f0b9fc18afe.jpg" width="600" style="max-width: 1201px; padding-bottom: 0px; vertical-align: bottom; display: inline !important; border-radius: 0%;" class="mcnImage">
                                                
                                            
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                </tbody>
            </table></td>
                                        </tr>
                                        <tr>
                                            <td valign="top" id="templateBody"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
                <tbody class="mcnTextBlockOuter">
                    <tr>
                        <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                            <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                      
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody><tr>
                                    
                                    <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; line-height: 125%;">
                                    
                                        <h1 style="text-align: center;"><span style="font-size:18px">Olá, ${
                                          client_user.firstname +
                                          ' ' +
                                          client_user.lastname
                                        }.</span></h1>
            
            <p style="text-align: center; line-height: 125%;"><span style="font-size:13px">Realizamos o pagamento de ${wa} HNT para a tua conta digital.<br>
            O montante deverá ficar disponível nos próximos minutos.<br>
            <br>
            Acompanha-nos no nosso twitter <a href="https://twitter.com/sharespotPT" target="_blank">@sharespotPT</a><br>
            <br>
            ---</span><br>
            <br>
            <em><span style="font-size:11px">Se tiveres algum problema, contacta-nos através de <a href="mailto:support@sharespot.pt?subject=Problema%20com%20pagamento" target="_blank">support@sharespot.pt</a></span></em></p>
            
                                    </td>
                                </tr>
                            </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                            
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table></td>
                                        </tr>
                                        <tr>
                                            <td valign="top" id="templateFooter"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowBlock" style="min-width:100%;">
                <tbody class="mcnFollowBlockOuter">
                    <tr>
                        <td align="center" valign="top" style="padding:9px" class="mcnFollowBlockInner">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentContainer" style="min-width:100%;">
                <tbody><tr>
                    <td align="center" style="padding-left:9px;padding-right:9px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%; border: 1px none;" class="mcnFollowContent">
                            <tbody><tr>
                                <td align="center" valign="top" style="padding-top:9px; padding-right:9px; padding-left:9px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0">
                                        <tbody><tr>
                                            <td align="center" valign="top">
                                                <!--[if mso]>
                                                <table align="center" border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                <![endif]-->
                                                
                                                    <!--[if mso]>
                                                    <td align="center" valign="top">
                                                    <![endif]-->
                                                    
                                                    
                                                        <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
                                                            <tbody><tr>
                                                                <td valign="top" style="padding-right:10px; padding-bottom:9px;" class="mcnFollowContentItemContainer">
                                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
                                                                        <tbody><tr>
                                                                            <td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
                                                                                <table align="left" border="0" cellpadding="0" cellspacing="0" width="">
                                                                                    <tbody><tr>
                                                                                        
                                                                                            <td align="center" valign="middle" width="24" class="mcnFollowIconContent">
                                                                                                <a href="http://sharespot.pt" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/outline-color-link-48.png" alt="Website" style="display:block;" height="24" width="24" class=""></a>
                                                                                            </td>
                                                                                        
                                                                                        
                                                                                            <td align="left" valign="middle" class="mcnFollowTextContent" style="padding-left:5px;">
                                                                                                <a href="http://sharespot.pt" target="" style="font-family: Helvetica;font-size: 12px;text-decoration: none;color: #FFFFFF;">Website</a>
                                                                                            </td>
                                                                                        
                                                                                    </tr>
                                                                                </tbody></table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody></table>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    
                                                    <!--[if mso]>
                                                    </td>
                                                    <![endif]-->
                                                
                                                    <!--[if mso]>
                                                    <td align="center" valign="top">
                                                    <![endif]-->
                                                    
                                                    
                                                        <table align="left" border="0" cellpadding="0" cellspacing="0" style="display:inline;">
                                                            <tbody><tr>
                                                                <td valign="top" style="padding-right:0; padding-bottom:9px;" class="mcnFollowContentItemContainer">
                                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnFollowContentItem">
                                                                        <tbody><tr>
                                                                            <td align="left" valign="middle" style="padding-top:5px; padding-right:10px; padding-bottom:5px; padding-left:9px;">
                                                                                <table align="left" border="0" cellpadding="0" cellspacing="0" width="">
                                                                                    <tbody><tr>
                                                                                        
                                                                                            <td align="center" valign="middle" width="24" class="mcnFollowIconContent">
                                                                                                <a href="https://twitter.com/sharespotPT" target="_blank"><img src="https://cdn-images.mailchimp.com/icons/social-block-v2/outline-color-twitter-48.png" alt="Twitter" style="display:block;" height="24" width="24" class=""></a>
                                                                                            </td>
                                                                                        
                                                                                        
                                                                                            <td align="left" valign="middle" class="mcnFollowTextContent" style="padding-left:5px;">
                                                                                                <a href="https://twitter.com/sharespotPT" target="" style="font-family: Helvetica;font-size: 12px;text-decoration: none;color: #FFFFFF;">Twitter</a>
                                                                                            </td>
                                                                                        
                                                                                    </tr>
                                                                                </tbody></table>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody></table>
                                                                </td>
                                                            </tr>
                                                        </tbody></table>
                                                    
                                                    <!--[if mso]>
                                                    </td>
                                                    <![endif]-->
                                                
                                                <!--[if mso]>
                                                </tr>
                                                </table>
                                                <![endif]-->
                                            </td>
                                        </tr>
                                    </tbody></table>
                                </td>
                            </tr>
                        </tbody></table>
                    </td>
                </tr>
            </tbody></table>
            
                        </td>
                    </tr>
                </tbody>
            </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
                <tbody class="mcnTextBlockOuter">
                    <tr>
                        <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                            <!--[if mso]>
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
                    <tr>
                    <![endif]-->
                      
                    <!--[if mso]>
                    <td valign="top" width="600" style="width:600px;">
                    <![endif]-->
                            <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                                <tbody>
                                
                            </tbody></table>
                    <!--[if mso]>
                    </td>
                    <![endif]-->
                            
                    <!--[if mso]>
                    </tr>
                    </table>
                    <![endif]-->
                        </td>
                    </tr>
                </tbody>
            </table></td>
                                        </tr>
                                    </table>
                                    <!--[if (gte mso 9)|(IE)]>
                                    </td>
                                    </tr>
                                    </table>
                                    <![endif]-->
                                    <!-- // END TEMPLATE -->
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>
            </html>
            
            `,
          });
          if (transporter && emailSent) {
            const wr = await WithdrawRequest.find({})
              .populate('wallet')
              .populate('client');
            res.status(200);
            res.json(wr);
          } else {
            res.status(500);
            throw new Error('Failed to send email!');
          }
        } else {
          res.status(400);
          throw new Error('Invalid email');
        }
      } else {
        res.status(500);
        throw new Error('Failed accept request!');
      }
    } else {
      res.status(404);
      throw new Error('Withdraw history not found!');
    }
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
    const wHistory = await WithdrawHistory.findOne({ wReqId: wreqId });
    if (wHistory) {
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

      const cwUpdate = await client_wallet.save();

      if (cwUpdate) {
        const rwr = await withdraw_request.remove();
        wHistory.status = 'Rejected';
        const updatewHistory = await wHistory.save();
        if (updatewHistory && rwr) {
          const wr = await WithdrawRequest.find({})
            .populate('wallet')
            .populate('client');
          res.status(200);
          res.json(wr);
        } else {
          res.status(500);
          throw new Error(`Rejection failed, History update failed!`);
        }
      } else {
        res.status(500);
        throw new Error('Rejection failed, Wallet update failed!');
      }
    } else {
      res.status(404);
      throw new Error('Rejection failed, WHistory not found!');
    }
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
};
