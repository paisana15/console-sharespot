import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ClientSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    wallet_address: {
      type: String,
      required: true,
    },
    total_hotspot: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ClientSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

ClientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Client = mongoose.model('Client', ClientSchema);

export default Client;
