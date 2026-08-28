import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isInternalNote: { type: Boolean, default: false },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  attachments: [{ url: String }]
}, { timestamps: true });

export const ComplaintComment = mongoose.model('ComplaintComment', commentSchema);