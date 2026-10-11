import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, isMongoConnected } from './data/dbStore.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

// Health check & DB status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: isMongoConnected ? 'MongoDB (Live)' : 'Local File Persistence (MongoDB Fallback)',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Initialize database & Start Server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 [E-Commerce API] Server running on http://localhost:${PORT}`);
    console.log(`📡 [Health Check] http://localhost:${PORT}/api/health`);
    console.log(`📦 [Products API] http://localhost:${PORT}/api/products`);
  });
}

startServer();
