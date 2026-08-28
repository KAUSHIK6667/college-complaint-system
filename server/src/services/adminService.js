import { Complaint } from '../models/Complaint.js';
import { Department } from '../models/Department.js';
import { User } from '../models/User.js';

export const listDepartments = () => Department.find().populate('headStaffId', 'name email').sort({ name: 1 });
export const createDepartment = (payload) => Department.create(payload);
export const updateDepartment = (id, payload) => Department.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

export async function getStats() {
  const [openTickets, totalTickets, priorityBreakdown, categoryBreakdown, departments, users] = await Promise.all([
    Complaint.countDocuments({ status: { $nin: ['Resolved', 'Closed'] } }),
    Complaint.countDocuments(),
    Complaint.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    Department.countDocuments(),
    User.countDocuments()
  ]);
  return { openTickets, totalTickets, priorityBreakdown, categoryBreakdown, departments, users };
}