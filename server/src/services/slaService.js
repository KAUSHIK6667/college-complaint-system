import { Complaint } from '../models/Complaint.js';

export async function escalateBreachedComplaints() {
  const result = await Complaint.updateMany({ status: { $in: ['Submitted', 'Assigned'] }, slaDueDate: { $lt: new Date() }, isEscalated: false }, { $set: { isEscalated: true, priority: 'Critical', updatedAt: new Date() } });
  return result.modifiedCount;
}