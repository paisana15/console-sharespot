import cors from 'cors';

const whiteList = ['http://localhost:3000', 'https://dashboard.sharespot.pt'];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whiteList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

export const corsWithOptions = cors(corsOptionsDelegate);
