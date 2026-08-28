import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  studentId: { type: String, trim: true },
  contactNumber: { type: String, trim: true },
  notificationPreferences: { email: { type: Boolean, default: true }, realtime: { type: Boolean, default: true } }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
