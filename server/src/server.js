import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { startEscalationFallback } from './queues/escalationQueue.js';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: env.clientUrl } });
app.set('io', io);
io.on('connection', (socket) => {
  socket.on('room:join', (room) => socket.join(String(room)));
});

await connectDatabase();
startEscalationFallback();
httpServer.listen(env.port, () => console.log(`EduFix API listening on http://localhost:${env.port}`));
