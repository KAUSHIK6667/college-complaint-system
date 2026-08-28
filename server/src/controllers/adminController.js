import * as adminService from '../services/adminService.js';

export async function stats(_request, response) { return response.json(await adminService.getStats()); }
export async function departments(_request, response) { return response.json({ departments: await adminService.listDepartments() }); }
export async function createDepartment(request, response) { try { return response.status(201).json({ department: await adminService.createDepartment(request.body) }); } catch (error) { return response.status(400).json({ message: error.message }); } }
export async function updateDepartment(request, response) { try { return response.json({ department: await adminService.updateDepartment(request.params.id, request.body) }); } catch (error) { return response.status(400).json({ message: error.message }); } }