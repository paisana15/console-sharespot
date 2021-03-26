import mongoose from 'mongoose';

const ManualWithdrawHistorySchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    mw_amount: {
      type: Number,
      default: 0.0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ManualWithdrawHistory = mongoose.model(
  'ManualWithdrawHistory',
  ManualWithdrawHistorySchema
);

export default ManualWithdrawHistory;
