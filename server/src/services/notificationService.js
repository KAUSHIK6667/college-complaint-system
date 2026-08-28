import nodemailer from 'nodemailer';
import { Notification } from '../models/Notification.js';

const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } }) : null;

export async function notify({ recipientId, email, title, message, type, complaintId }) {
  await Notification.create({ recipientId, complaintId, title, message, type });
  if (transporter && email) await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: email, subject: title, text: message });
}