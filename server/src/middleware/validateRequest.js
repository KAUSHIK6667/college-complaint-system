import { validationResult } from 'express-validator';

export function validateRequest(request, response, next) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.status(422).json({ message: errors.array()[0].msg, errors: errors.array() });
  next();
}