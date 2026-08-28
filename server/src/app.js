import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { env } from './config/env.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: (origin, callback) => {
	const isLocalDevelopment = env.nodeEnv !== 'production' && origin && /^https?:\/\/localhost:\d+$/.test(origin);
	if (!origin || origin === env.clientUrl || isLocalDevelopment) return callback(null, true);
	return callback(new Error('Origin is not allowed by CORS.'));
} }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'edufix-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use((error, _request, response, _next) => response.status(500).json({ message: 'Internal server error.' }));
