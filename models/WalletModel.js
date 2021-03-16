import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const WalletSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  totalRewards: {
    type: Number,
    default: 0.0,
  },
  totalWithdraw: {
    type: Number,
    default: 0.0,
  },
  wallet_balance: {
    type: Number,
    default: 0.0,
  },
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;
