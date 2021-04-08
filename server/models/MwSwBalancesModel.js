import mongoose from 'mongoose';

const MwSwSchema = new mongoose.Schema(
  {
    mw_balance: {
      type: Number,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

const MwSwBalance = mongoose.model('mwswbalance', MwSwSchema);

export default MwSwBalance;
