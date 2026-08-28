import * as authService from '../services/authService.js';

const handleError = (response, error) => response.status(400).json({ message: error.message });

export async function register(request, response) {
  try { return response.status(201).json(await authService.registerStudent(request.body)); } catch (error) { return handleError(response, error); }
}

export async function login(request, response) {
  try { return response.json(await authService.loginUser(request.body)); } catch (error) { return handleError(response, error); }
}

export async function me(request, response) {
  try { return response.json({ user: await authService.getProfile(request.auth.sub) }); } catch (error) { return handleError(response, error); }
}

export async function profile(request, response) {
  try { return response.json({ user: await authService.updateProfile(request.auth.sub, request.body) }); } catch (error) { return handleError(response, error); }
}
