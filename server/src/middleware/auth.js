import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function protect(request, response, next) {
  const token = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.slice(7)
    : null;
  if (!token) return response.status(401).json({ message: 'Authentication required.' });
  try {
    request.auth = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired session.' });
  }
}

export const authorize = (...roles) => (request, response, next) => {
  if (!roles.includes(request.auth.role)) return response.status(403).json({ message: 'Insufficient permissions.' });
  next();
};
