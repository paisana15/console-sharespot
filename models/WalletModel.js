import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  wallet_balance: {
    type: Double,
    default: 0.0,
  },
});

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;
