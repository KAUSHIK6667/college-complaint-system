import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  headStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slaHours: { Low: { type: Number, default: 168 }, Medium: { type: Number, default: 72 }, High: { type: Number, default: 48 }, Critical: { type: Number, default: 24 } }
}, { timestamps: true });

export const Department = mongoose.model('Department', departmentSchema);