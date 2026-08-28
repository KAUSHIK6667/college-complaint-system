import { io } from 'socket.io-client';

const defaultSocketUrl = process.env.NODE_ENV === 'production'
  ? 'https://college-complaint-system-bqhb.onrender.com'
  : 'http://localhost:5000';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || defaultSocketUrl, { autoConnect: false });

export function joinComplaintRoom(complaintId) {
  socket.connect();
  socket.emit('room:join', `complaint:${complaintId}`);
  return () => socket.disconnect();
}