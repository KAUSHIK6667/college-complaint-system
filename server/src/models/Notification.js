import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['STATUS_CHANGE', 'ASSIGNMENT', 'COMMENT', 'ESCALATION'], required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);