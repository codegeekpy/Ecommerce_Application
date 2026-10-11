import express from 'express';
import { store, isMongoConnected } from '../data/dbStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const stats = await store.getDashboardStats();
    res.json({
      ...stats,
      databaseType: isMongoConnected ? 'MongoDB (Connected)' : 'Local Resilient Store (MongoDB Fallback)',
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats dashboard error:', error);
    res.status(500).json({ message: 'Failed to retrieve stats' });
  }
});

export default router;
