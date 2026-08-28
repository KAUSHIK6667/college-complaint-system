import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: { type: String, enum: ['Classroom', 'Laboratory', 'Hostel', 'Wi-Fi', 'Infrastructure', 'Transportation', 'Cleanliness', 'Other'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Submitted' },
  location: { building: String, floor: String, roomNumber: String, additionalDetails: String },
  attachments: [{ url: String, publicId: String, fileType: String }],
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiMetadata: { suggestedCategory: String, confidenceScore: Number, isPotentialDuplicate: Boolean, duplicateOfComplaintId: mongoose.Schema.Types.ObjectId },
  resolutionDetails: { summary: String, resolvedAt: Date, proofAttachments: [{ url: String }] },
  feedback: { rating: { type: Number, min: 1, max: 5 }, comment: String, createdAt: Date },
  slaDueDate: Date,
  isEscalated: { type: Boolean, default: false },
  statusHistory: [{ status: String, changedBy: mongoose.Schema.Types.ObjectId, note: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Complaint = mongoose.model('Complaint', complaintSchema);