import * as complaintService from '../services/complaintService.js';

export async function create(request, response) {
  try {
    const complaint = await complaintService.createComplaint(request.body, request.auth.sub);
    request.app.get('io')?.to(`user:${request.auth.sub}`).emit('complaint:created', complaint);
    return response.status(201).json({ complaint });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
}

export async function list(request, response) {
  try {
    return response.json({ complaints: await complaintService.listComplaints(request.auth.sub, request.query) });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
}

export async function detail(request, response) {
  try { return response.json(await complaintService.getComplaint(request.params.id, request.auth)); } catch (error) { return response.status(404).json({ message: error.message }); }
}

export async function status(request, response) {
  try { const complaint = await complaintService.updateStatus(request.params.id, request.body.status, request.auth.sub, request.body.note); request.app.get('io')?.to(`complaint:${request.params.id}`).emit('complaint:status_updated', complaint); return response.json({ complaint }); } catch (error) { return response.status(400).json({ message: error.message }); }
}

export async function comment(request, response) {
  try { const commentRecord = await complaintService.addComment(request.params.id, request.auth.sub, request.body.message, request.body.isInternalNote); request.app.get('io')?.to(`complaint:${request.params.id}`).emit('complaint:comment_added', commentRecord); return response.status(201).json({ comment: commentRecord }); } catch (error) { return response.status(400).json({ message: error.message }); }
}

export async function feedback(request, response) {
  try { return response.json({ complaint: await complaintService.submitFeedback(request.params.id, request.auth.sub, request.body.rating, request.body.comment) }); } catch (error) { return response.status(400).json({ message: error.message }); }
}

export async function assign(request, response) {
  try { return response.json({ complaint: await complaintService.assignComplaint(request.params.id, request.body.departmentId, request.body.staffId) }); } catch (error) { return response.status(400).json({ message: error.message }); }
}