import mongoose from 'mongoose';

const WithdrawHistorySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    wReqId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WithdrawRequest',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawHistory = mongoose.model(
  'WithdrawHistory',
  WithdrawHistorySchema
);

export default WithdrawHistory;
