import mongoose from 'mongoose';

const WithdrawRequestSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    amount: {
      type: Number,
      default: 0.0,
      required: true,
    },
    w_qr_code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawRequest = mongoose.model(
  'WithdrawRequest',
  WithdrawRequestSchema
);

export default WithdrawRequest;
