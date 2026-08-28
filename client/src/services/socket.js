import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });

export function joinComplaintRoom(complaintId) {
  socket.connect();
  socket.emit('room:join', `complaint:${complaintId}`);
  return () => socket.disconnect();
}