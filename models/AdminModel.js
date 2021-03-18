import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

const AdminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    admin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// AdminSchema.methods.verifyPassword = async function (enteredPassword) {
//   console.log(enteredPassword);
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const Admin = mongoose.model('admin', AdminSchema);
export default Admin;
