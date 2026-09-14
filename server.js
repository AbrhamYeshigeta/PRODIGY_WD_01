import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import errorMiddleware from './src/middleware/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting on auth
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', limiter);
app.use('/api/auth/register', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/health', (req, res) => res.json({ success: true }));

// Errors
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Kill the process using it or set PORT to a different value.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
};

start();