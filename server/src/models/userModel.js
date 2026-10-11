import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    addresses: [
      {
        fullName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
