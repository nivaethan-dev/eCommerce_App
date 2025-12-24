import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin', immutable: true },
  // Account Locking
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update `updatedAt` automatically
adminSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;