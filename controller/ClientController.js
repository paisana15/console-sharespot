import asyncHandler from 'express-async-handler';
import Client from '../models/ClientModel.js';
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
export { clientLogin };
