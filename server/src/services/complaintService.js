import { Complaint } from '../models/Complaint.js';
import { Department } from '../models/Department.js';
import { ComplaintComment } from '../models/ComplaintComment.js';
import { classifyComplaint } from './aiService.js';

export async function createComplaint(payload, studentId) {
  const ticketId = `CMP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const ai = await classifyComplaint(payload.title, payload.description);
  const priority = payload.priority || ai.priority;
  const complaint = await Complaint.create({ ...payload, ticketId, studentId, priority, aiMetadata: ai, statusHistory: [{ status: 'Submitted', changedBy: studentId }] });
  return complaint;
}

export async function listComplaints(studentId, filters = {}) {
  const query = { studentId };
  for (const key of ['status', 'priority', 'category']) if (filters[key]) query[key] = filters[key];
  return Complaint.find(query).populate('assignedDepartmentId', 'name code').sort({ createdAt: -1 });
}

export async function getComplaint(id, user) {
  const complaint = await Complaint.findOne({ _id: id, ...(user.role === 'student' ? { studentId: user.sub } : {}) }).populate('assignedDepartmentId assignedStaffId', 'name email');
  if (!complaint) throw new Error('Complaint not found.');
  const comments = await ComplaintComment.find({ complaintId: id, ...(user.role === 'student' ? { isInternalNote: false } : {}) }).populate('authorId', 'name role').sort({ createdAt: 1 });
  return { complaint, comments };
}

export async function updateStatus(id, status, actorId, note) {
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error('Complaint not found.');
  const allowed = { Submitted: ['Under Review'], 'Under Review': ['Assigned', 'In Progress'], Assigned: ['In Progress'], 'In Progress': ['Resolved'], Resolved: ['Closed'] };
  if (status !== complaint.status && !allowed[complaint.status]?.includes(status)) throw new Error(`Cannot move a complaint from ${complaint.status} to ${status}.`);
  complaint.status = status; complaint.updatedAt = new Date(); complaint.statusHistory.push({ status, changedBy: actorId, note });
  if (status === 'Resolved') complaint.resolutionDetails = { ...complaint.resolutionDetails, resolvedAt: new Date() };
  return complaint.save();
}

export async function addComment(id, authorId, message, isInternalNote = false) {
  if (!await Complaint.exists({ _id: id })) throw new Error('Complaint not found.');
  return ComplaintComment.create({ complaintId: id, authorId, message, isInternalNote });
}

export async function submitFeedback(id, studentId, rating, comment) {
  const complaint = await Complaint.findOne({ _id: id, studentId, status: { $in: ['Resolved', 'Closed'] } });
  if (!complaint) throw new Error('Only your resolved complaints can receive feedback.');
  complaint.feedback = { rating, comment, createdAt: new Date() }; return complaint.save();
}

export async function assignComplaint(id, departmentId, staffId) {
  const complaint = await Complaint.findByIdAndUpdate(id, { assignedDepartmentId: departmentId, assignedStaffId: staffId, status: 'Assigned', updatedAt: new Date(), $push: { statusHistory: { status: 'Assigned', changedBy: staffId } } }, { new: true, runValidators: true });
  if (!complaint) throw new Error('Complaint not found.');
  return complaint;
}