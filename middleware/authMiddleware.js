import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import Client from '../models/ClientModel.js';
import Admin from '../models/AdminModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const client = await Client.findById(decoded.id).select('-password');
      if (client) {
        req.user = await Client.findById(decoded.id).select('-password');
        next();
      } else {
        res.status(401);
        throw new Error('Not authirized! Token failed');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authirized! Token failed.');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized! No Token');
  }
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Admin.findById(decoded.id).select('-password');
      if (user) {
        if (user.admin) {
          req.user = user;
        } else {
          throw new Error('You are not admin yet!');
        }
      } else {
        res.status(401);
        throw new Error('Not authorized! Token failed');
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error(
        (error && error.message) || 'Not authirized! Token failed.'
      );
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized! No Token');
  }
});

export { protect, verifyAdmin };
