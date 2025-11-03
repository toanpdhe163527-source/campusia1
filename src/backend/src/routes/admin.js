// campusia-backend/src/routes/admin.js
// Admin routes for managing users

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

/**
 * Middleware to verify admin role
 */
const verifyAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.username === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Unauthorized: Admin access required'
    });
  }
};

/**
 * GET /api/admin/users
 * Get all users with stats (admin only)
 */
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.getAllWithStats();

    res.json({
      success: true,
      users,
      total: users.length
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi: ' + error.message
    });
  }
});

/**
 * GET /api/admin/users/:userId/events
 * Get user's participation history (admin only)
 */
router.get('/users/:userId/events', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const events = await User.getParticipationHistory(userId);

    res.json({
      success: true,
      events
    });

  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi: ' + error.message
    });
  }
});

/**
 * GET /api/admin/stats
 * Get overall statistics (admin only)
 */
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.getTotalCount();

    res.json({
      success: true,
      stats: {
        totalUsers
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi: ' + error.message
    });
  }
});

module.exports = router;
