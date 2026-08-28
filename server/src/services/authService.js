import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId, departmentId: user.departmentId });

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function registerStudent({ name, email, password, studentId, contactNumber }) {
  if (!email.toLowerCase().endsWith(`@${env.collegeEmailDomain}`)) throw new Error('Use your college email address.');
  if (await User.exists({ email: email.toLowerCase() })) throw new Error('An account with this email already exists.');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, studentId, contactNumber });
  return { token: signToken(user), user: publicUser(user) };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new Error('Invalid email or password.');
  return { token: signToken(user), user: publicUser(user) };
}

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found.');
  return publicUser(user);
}

export async function updateProfile(userId, changes) {
  const allowed = ['name', 'contactNumber', 'notificationPreferences'];
  const update = Object.fromEntries(Object.entries(changes).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
  if (!user) throw new Error('User not found.');
  return publicUser(user);
}
